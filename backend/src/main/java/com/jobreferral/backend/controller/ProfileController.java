package com.jobreferral.backend.controller;

import com.jobreferral.backend.model.CandidateProfile;
import com.jobreferral.backend.repository.CandidateProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for candidate developer profiles.
 *
 * Endpoints (all under /api/profile):
 *   POST /save         – create or update profile for the given email
 *   GET  /me?email=… – fetch profile by email (404 if not found)
 *   GET  /exists?email=… – quick boolean check used by login redirect
 */
@RestController
@RequestMapping("/api/profile")
@CrossOrigin
public class ProfileController {

    @Autowired
    private CandidateProfileRepository profileRepository;

    /* ─── Save / Update ──────────────────────────────────────────────── */
    @PostMapping("/save")
    public ResponseEntity<?> saveProfile(@RequestBody Map<String, Object> req) {
        String email = (String) req.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "email is required"));
        }

        // Upsert – find existing row or create new
        CandidateProfile profile = profileRepository.findByEmail(email)
                .orElse(new CandidateProfile());

        profile.setEmail(email);
        profile.setName(str(req, "name"));
        profile.setPhoto(str(req, "photo"));
        profile.setCollege(str(req, "college"));
        profile.setDegree(str(req, "degree"));
        profile.setGraduationYear(str(req, "graduationYear"));
        profile.setSkills(str(req, "skills"));        // JSON string from frontend
        profile.setInterests(str(req, "interests"));  // JSON string from frontend
        profile.setExperienceLevel(str(req, "experienceLevel"));
        profile.setGithub(str(req, "github"));
        profile.setLinkedin(str(req, "linkedin"));
        profile.setProjectDomain(str(req, "projectDomain"));
        profile.setAvailability(str(req, "availability"));
        profile.setUpdatedAt(LocalDateTime.now());

        if (profile.getCompletedAt() == null) {
            profile.setCompletedAt(LocalDateTime.now());
        }

        profileRepository.save(profile);
        return ResponseEntity.ok(Map.of("message", "Profile saved successfully"));
    }

    /* ─── Fetch by email ─────────────────────────────────────────────── */
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        return profileRepository.findByEmail(email)
                .map(p -> ResponseEntity.ok(toMap(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    /* ─── Existence check (used by login page redirect) ─────────────── */
    @GetMapping("/exists")
    public ResponseEntity<?> profileExists(@RequestParam String email) {
        boolean exists = profileRepository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    /* ─── helpers ────────────────────────────────────────────────────── */
    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : null;
    }

    private Map<String, Object> toMap(CandidateProfile p) {
        Map<String, Object> m = new HashMap<>();
        m.put("email",           p.getEmail());
        m.put("name",            p.getName());
        m.put("photo",           p.getPhoto());
        m.put("college",         p.getCollege());
        m.put("degree",          p.getDegree());
        m.put("graduationYear",  p.getGraduationYear());
        m.put("skills",          p.getSkills());      // JSON string – parsed on frontend
        m.put("interests",       p.getInterests());   // JSON string – parsed on frontend
        m.put("experienceLevel", p.getExperienceLevel());
        m.put("github",          p.getGithub());
        m.put("linkedin",        p.getLinkedin());
        m.put("projectDomain",   p.getProjectDomain());
        m.put("availability",    p.getAvailability());
        m.put("completedAt",     p.getCompletedAt() != null ? p.getCompletedAt().toString() : null);
        m.put("updatedAt",       p.getUpdatedAt()   != null ? p.getUpdatedAt().toString()   : null);
        return m;
    }
}
