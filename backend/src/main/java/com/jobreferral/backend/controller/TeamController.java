package com.jobreferral.backend.controller;

import com.jobreferral.backend.model.ChatMessage;
import com.jobreferral.backend.model.TeamConnection;
import com.jobreferral.backend.model.CandidateProfile;
import com.jobreferral.backend.repository.ChatMessageRepository;
import com.jobreferral.backend.repository.TeamConnectionRepository;
import com.jobreferral.backend.repository.CandidateProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * REST controller for teammate connections and in-app chat.
 *
 * All endpoints are under /api/team and are open (no JWT required)
 * to be consistent with the existing /api/profile/** pattern.
 *
 * Endpoints:
 *   POST /invite                       – send a teammate invite
 *   GET  /invites/pending?email=       – list pending invites for a user
 *   GET  /invites/sent?email=          – list emails already invited by user
 *   POST /invite/accept                – accept an invite by id
 *   POST /invite/reject                – reject an invite by id
 *   GET  /teammates?email=             – list all accepted teammates with profile data
 *   POST /chat/send                    – send a chat message
 *   GET  /chat/messages?e1=&e2=        – fetch full conversation history
 */
@RestController
@RequestMapping("/api/team")
@CrossOrigin
public class TeamController {

    @Autowired private TeamConnectionRepository connectionRepo;
    @Autowired private ChatMessageRepository    chatRepo;
    @Autowired private CandidateProfileRepository profileRepo;

    // ── POST /api/team/invite ─────────────────────────────────────────────
    @PostMapping("/invite")
    public ResponseEntity<?> sendInvite(@RequestBody Map<String, Object> req) {
        String fromEmail = str(req, "fromEmail");
        String toEmail   = str(req, "toEmail");

        if (fromEmail == null || toEmail == null || fromEmail.equals(toEmail)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid emails"));
        }

        // Idempotent: if invite already exists from this user to target, return existing
        Optional<TeamConnection> existing = connectionRepo.findByFromEmailAndToEmail(fromEmail, toEmail);
        if (existing.isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Invite already sent", "status", existing.get().getStatus()));
        }

        TeamConnection conn = new TeamConnection();
        conn.setFromEmail(fromEmail);
        conn.setToEmail(toEmail);
        conn.setFromName(str(req, "fromName"));
        conn.setFromPhoto(str(req, "fromPhoto"));
        conn.setFromCollege(str(req, "fromCollege"));
        conn.setFromDegree(str(req, "fromDegree"));
        conn.setFromDomain(str(req, "fromDomain"));
        conn.setFromAvailability(str(req, "fromAvailability"));
        conn.setFromSkills(str(req, "fromSkills")); // JSON string
        conn.setStatus("pending");

        connectionRepo.save(conn);
        return ResponseEntity.ok(Map.of("message", "Invite sent successfully"));
    }

    // ── GET /api/team/invites/pending?email= ──────────────────────────────
    @GetMapping("/invites/pending")
    public ResponseEntity<?> getPendingInvites(@RequestParam String email) {
        List<TeamConnection> pending = connectionRepo.findByToEmailAndStatus(email, "pending");
        List<Map<String, Object>> result = pending.stream().map(this::connectionToMap).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // ── GET /api/team/invites/sent?email= ────────────────────────────────
    @GetMapping("/invites/sent")
    public ResponseEntity<?> getSentInvites(@RequestParam String email) {
        List<TeamConnection> sent = connectionRepo.findByFromEmail(email);
        // Return a list of {toEmail, status} so the frontend knows who is already invited/connected
        List<Map<String, Object>> result = sent.stream().map(c -> {
            Map<String, Object> m = new HashMap<>();
            m.put("toEmail", c.getToEmail());
            m.put("status",  c.getStatus());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // ── POST /api/team/invite/accept ──────────────────────────────────────
    @PostMapping("/invite/accept")
    public ResponseEntity<?> acceptInvite(@RequestBody Map<String, Object> req) {
        Long id = Long.valueOf(req.get("id").toString());
        Optional<TeamConnection> opt = connectionRepo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        TeamConnection conn = opt.get();
        conn.setStatus("accepted");
        connectionRepo.save(conn);
        return ResponseEntity.ok(Map.of("message", "Invite accepted"));
    }

    // ── POST /api/team/invite/reject ──────────────────────────────────────
    @PostMapping("/invite/reject")
    public ResponseEntity<?> rejectInvite(@RequestBody Map<String, Object> req) {
        Long id = Long.valueOf(req.get("id").toString());
        Optional<TeamConnection> opt = connectionRepo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        TeamConnection conn = opt.get();
        conn.setStatus("rejected");
        connectionRepo.save(conn);
        return ResponseEntity.ok(Map.of("message", "Invite rejected"));
    }

    // ── GET /api/team/teammates?email= ────────────────────────────────────
    /**
     * Returns all accepted teammates for the given email, enriched with
     * their latest profile data from candidate_profiles.
     */
    @GetMapping("/teammates")
    public ResponseEntity<?> getTeammates(@RequestParam String email) {
        List<TeamConnection> accepted = connectionRepo.findAcceptedConnectionsForUser(email);

        List<Map<String, Object>> teammates = accepted.stream().map(conn -> {
            // Determine the OTHER person's email
            String otherEmail = conn.getFromEmail().equals(email) ? conn.getToEmail() : conn.getFromEmail();

            // Try to load their latest profile from DB
            Optional<CandidateProfile> profileOpt = profileRepo.findByEmail(otherEmail);

            Map<String, Object> m = new HashMap<>();
            m.put("email", otherEmail);
            m.put("connectionId", conn.getId());

            if (profileOpt.isPresent()) {
                CandidateProfile p = profileOpt.get();
                m.put("name",            p.getName()            != null ? p.getName()            : conn.getFromEmail().equals(otherEmail) ? conn.getFromName() : "");
                m.put("photo",           p.getPhoto()           != null ? p.getPhoto()           : conn.getFromEmail().equals(otherEmail) ? conn.getFromPhoto() : null);
                m.put("college",         p.getCollege()         != null ? p.getCollege()         : conn.getFromCollege());
                m.put("degree",          p.getDegree()          != null ? p.getDegree()          : conn.getFromDegree());
                m.put("projectDomain",   p.getProjectDomain()   != null ? p.getProjectDomain()   : conn.getFromDomain());
                m.put("availability",    p.getAvailability()    != null ? p.getAvailability()    : conn.getFromAvailability());
                m.put("experienceLevel", p.getExperienceLevel());
                m.put("skills",          p.getSkills());    // JSON string, frontend parses
                m.put("interests",       p.getInterests()); // JSON string
            } else {
                // Fallback to snapshot data captured at invite time (only available if they were the sender)
                boolean wasSender = conn.getFromEmail().equals(otherEmail);
                m.put("name",          wasSender ? conn.getFromName()         : otherEmail);
                m.put("photo",         wasSender ? conn.getFromPhoto()        : null);
                m.put("college",       wasSender ? conn.getFromCollege()      : "");
                m.put("degree",        wasSender ? conn.getFromDegree()       : "");
                m.put("projectDomain", wasSender ? conn.getFromDomain()       : "");
                m.put("availability",  wasSender ? conn.getFromAvailability() : "");
                m.put("skills",        wasSender ? conn.getFromSkills()       : "[]");
                m.put("interests",     "[]");
            }
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(teammates);
    }

    // ── POST /api/team/chat/send ──────────────────────────────────────────
    @PostMapping("/chat/send")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, Object> req) {
        String fromEmail = str(req, "fromEmail");
        String toEmail   = str(req, "toEmail");
        String text      = str(req, "text");
        String fromName  = str(req, "fromName");

        if (fromEmail == null || toEmail == null || text == null || text.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "fromEmail, toEmail and text are required"));
        }

        ChatMessage msg = new ChatMessage();
        msg.setFromEmail(fromEmail);
        msg.setToEmail(toEmail);
        msg.setFromName(fromName);
        msg.setText(text.trim());
        msg.setSentAt(LocalDateTime.now());

        ChatMessage saved = chatRepo.save(msg);
        return ResponseEntity.ok(messageToMap(saved));
    }

    // ── GET /api/team/chat/messages?e1=&e2= ──────────────────────────────
    @GetMapping("/chat/messages")
    public ResponseEntity<?> getMessages(@RequestParam String e1, @RequestParam String e2) {
        List<ChatMessage> msgs = chatRepo.findConversation(e1, e2);
        List<Map<String, Object>> result = msgs.stream().map(this::messageToMap).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private Map<String, Object> connectionToMap(TeamConnection c) {
        Map<String, Object> m = new HashMap<>();
        m.put("id",               c.getId());
        m.put("fromEmail",        c.getFromEmail());
        m.put("toEmail",          c.getToEmail());
        m.put("fromName",         c.getFromName());
        m.put("fromPhoto",        c.getFromPhoto());
        m.put("fromCollege",      c.getFromCollege());
        m.put("fromDegree",       c.getFromDegree());
        m.put("fromDomain",       c.getFromDomain());
        m.put("fromAvailability", c.getFromAvailability());
        m.put("fromSkills",       c.getFromSkills());
        m.put("status",           c.getStatus());
        m.put("createdAt",        c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
        return m;
    }

    private Map<String, Object> messageToMap(ChatMessage m) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",        m.getId());
        map.put("from",      m.getFromEmail());
        map.put("to",        m.getToEmail());
        map.put("fromName",  m.getFromName());
        map.put("text",      m.getText());
        map.put("time",      m.getSentAt() != null ? m.getSentAt().toString() : null);
        return map;
    }

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : null;
    }
}
