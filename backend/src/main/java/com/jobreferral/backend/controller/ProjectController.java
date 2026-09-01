package com.jobreferral.backend.controller;

import com.jobreferral.backend.model.CandidateProfile;
import com.jobreferral.backend.model.Project;
import com.jobreferral.backend.model.ProjectMilestone;
import com.jobreferral.backend.model.ProjectTask;
import com.jobreferral.backend.repository.CandidateProfileRepository;
import com.jobreferral.backend.repository.ProjectMilestoneRepository;
import com.jobreferral.backend.repository.ProjectRepository;
import com.jobreferral.backend.repository.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * REST Controller for Projects, Kanban Tasks, and Milestones.
 * Endpoints are under /api/projects.
 */
@RestController
@RequestMapping("/api/projects")
@CrossOrigin
public class ProjectController {

    @Autowired private ProjectRepository projectRepo;
    @Autowired private ProjectTaskRepository taskRepo;
    @Autowired private ProjectMilestoneRepository milestoneRepo;
    @Autowired private CandidateProfileRepository profileRepo;

    // ── GET /api/projects/user?email= ──────────────────────────────────────
    @GetMapping("/user")
    public ResponseEntity<?> getProjectsForUser(@RequestParam String email) {
        List<Project> projects = projectRepo.findProjectsForUser(email);
        List<Map<String, Object>> result = projects.stream()
                .map(this::enrichProject)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // ── POST /api/projects/create ──────────────────────────────────────────
    @PostMapping("/create")
    public ResponseEntity<?> createProject(@RequestBody Map<String, Object> req) {
        String name = str(req, "name");
        String leaderEmail = str(req, "leaderEmail");

        if (name == null || name.isBlank() || leaderEmail == null || leaderEmail.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Project name and leaderEmail are required"));
        }

        Project p = new Project();
        p.setName(name.trim());
        p.setDescription(str(req, "description"));
        p.setCategory(str(req, "category", "Web Development"));
        p.setSkills(str(req, "skills", "[]"));
        p.setStatus(str(req, "status", "active"));
        p.setLeaderEmail(leaderEmail);
        p.setLeaderName(str(req, "leaderName", leaderEmail));
        p.setLeaderPhoto(str(req, "leaderPhoto"));
        p.setDueDate(str(req, "dueDate", ""));

        // Members: ensure leader is always in members list
        Set<String> memberSet = new LinkedHashSet<>();
        memberSet.add(leaderEmail);

        Object membersRaw = req.get("memberEmails");
        if (membersRaw instanceof List) {
            for (Object m : (List<?>) membersRaw) {
                if (m != null && !m.toString().isBlank()) {
                    memberSet.add(m.toString().trim());
                }
            }
        } else if (membersRaw instanceof String && !((String) membersRaw).isBlank()) {
            try {
                // Try parsing JSON array or comma-separated
                String s = (String) membersRaw;
                if (s.startsWith("[")) {
                    s = s.replaceAll("[\\[\\]\"\\s]", "");
                }
                for (String part : s.split(",")) {
                    if (!part.isBlank()) memberSet.add(part.trim());
                }
            } catch (Exception ignored) {}
        }

        p.setMemberEmails(listToJson(new ArrayList<>(memberSet)));
        Project saved = projectRepo.save(p);

        return ResponseEntity.ok(enrichProject(saved));
    }

    // ── GET /api/projects/{id} ─────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable Long id) {
        Optional<Project> opt = projectRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(enrichProject(opt.get()));
    }

    // ── GET /api/projects/{id}/tasks ───────────────────────────────────────
    @GetMapping("/{id}/tasks")
    public ResponseEntity<?> getProjectTasks(@PathVariable Long id) {
        List<ProjectTask> tasks = taskRepo.findByProjectIdOrderByCreatedAtAsc(id);
        return ResponseEntity.ok(tasks);
    }

    // ── POST /api/projects/{id}/tasks ──────────────────────────────────────
    @PostMapping("/{id}/tasks")
    public ResponseEntity<?> createTask(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        Optional<Project> opt = projectRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        String title = str(req, "title");
        if (title == null || title.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Task title is required"));
        }

        ProjectTask t = new ProjectTask();
        t.setProjectId(id);
        t.setTitle(title.trim());
        t.setDescription(str(req, "description"));
        t.setCategoryTag(str(req, "categoryTag", "general"));
        t.setStatus(str(req, "status", "Backlog"));
        t.setPriority(str(req, "priority", "medium"));
        t.setDueDate(str(req, "dueDate"));
        t.setAssignedEmail(str(req, "assignedEmail"));
        t.setAssignedName(str(req, "assignedName"));
        t.setAssignedPhoto(str(req, "assignedPhoto"));

        if (req.get("points") != null) {
            try {
                t.setPoints(Integer.parseInt(req.get("points").toString()));
            } catch (Exception ignored) {
                t.setPoints(5);
            }
        }
        if (req.get("milestoneId") != null) {
            try {
                t.setMilestoneId(Long.parseLong(req.get("milestoneId").toString()));
            } catch (Exception ignored) {}
        }

        ProjectTask saved = taskRepo.save(t);
        return ResponseEntity.ok(saved);
    }

    // ── PATCH /api/projects/tasks/{taskId}/status ──────────────────────────
    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long taskId, @RequestBody Map<String, Object> req) {
        Optional<ProjectTask> opt = taskRepo.findById(taskId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        ProjectTask t = opt.get();
        String newStatus = str(req, "status");
        if (newStatus != null && !newStatus.isBlank()) {
            t.setStatus(newStatus.trim());
            taskRepo.save(t);
        }
        return ResponseEntity.ok(t);
    }

    // ── GET /api/projects/{id}/milestones ──────────────────────────────────
    @GetMapping("/{id}/milestones")
    public ResponseEntity<?> getProjectMilestones(@PathVariable Long id) {
        List<ProjectMilestone> milestones = milestoneRepo.findByProjectIdOrderByCreatedAtAsc(id);
        List<Map<String, Object>> result = milestones.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("projectId", m.getProjectId());
            map.put("title", m.getTitle());
            map.put("description", m.getDescription());
            map.put("targetDate", m.getTargetDate());
            map.put("status", m.getStatus());

            // Linked tasks calculation
            List<ProjectTask> linkedTasks = taskRepo.findByMilestoneId(m.getId());
            int total = linkedTasks.size();
            long done = linkedTasks.stream().filter(t -> "Done".equalsIgnoreCase(t.getStatus())).count();
            int progress = total > 0 ? (int) Math.round(((double) done / total) * 100) : (
                    "Completed".equalsIgnoreCase(m.getStatus()) ? 100 : "In Progress".equalsIgnoreCase(m.getStatus()) ? 50 : 0
            );
            map.put("totalTasks", total);
            map.put("completedTasks", done);
            map.put("progress", progress);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // ── POST /api/projects/{id}/milestones ─────────────────────────────────
    @PostMapping("/{id}/milestones")
    public ResponseEntity<?> createMilestone(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        String title = str(req, "title");
        if (title == null || title.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Milestone title is required"));
        }

        ProjectMilestone m = new ProjectMilestone();
        m.setProjectId(id);
        m.setTitle(title.trim());
        m.setDescription(str(req, "description"));
        m.setTargetDate(str(req, "targetDate"));
        m.setStatus(str(req, "status", "In Progress"));

        ProjectMilestone saved = milestoneRepo.save(m);
        return ResponseEntity.ok(saved);
    }

    // ── PATCH /api/projects/milestones/{milestoneId}/status ────────────────
    @PatchMapping("/milestones/{milestoneId}/status")
    public ResponseEntity<?> updateMilestoneStatus(@PathVariable Long milestoneId, @RequestBody Map<String, Object> req) {
        Optional<ProjectMilestone> opt = milestoneRepo.findById(milestoneId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        ProjectMilestone m = opt.get();
        String newStatus = str(req, "status");
        if (newStatus != null && !newStatus.isBlank()) {
            m.setStatus(newStatus.trim());
            milestoneRepo.save(m);
        }
        return ResponseEntity.ok(m);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private Map<String, Object> enrichProject(Project p) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", p.getId());
        m.put("name", p.getName());
        m.put("description", p.getDescription());
        m.put("category", p.getCategory());
        m.put("skills", p.getSkills());
        m.put("status", p.getStatus());
        m.put("leaderEmail", p.getLeaderEmail());
        m.put("leaderName", p.getLeaderName());
        m.put("leaderPhoto", p.getLeaderPhoto());
        m.put("dueDate", p.getDueDate());
        m.put("createdAt", p.getCreatedAt() != null ? p.getCreatedAt().toString() : null);

        // Calculate tasks & progress
        long totalTasks = taskRepo.countByProjectId(p.getId());
        long doneTasks  = taskRepo.countByProjectIdAndStatus(p.getId(), "Done");
        int progress = totalTasks > 0 ? (int) Math.round(((double) doneTasks / totalTasks) * 100) : 0;

        m.put("totalTasks", totalTasks);
        m.put("completedTasks", doneTasks);
        m.put("progress", progress);

        // Parse member emails and fetch current profile details
        List<String> emails = parseMemberList(p.getMemberEmails());
        List<Map<String, Object>> members = new ArrayList<>();

        for (String email : emails) {
            Map<String, Object> mem = new HashMap<>();
            mem.put("email", email);
            boolean isLeader = email.equalsIgnoreCase(p.getLeaderEmail());
            mem.put("isLeader", isLeader);

            Optional<CandidateProfile> profOpt = profileRepo.findByEmail(email);
            if (profOpt.isPresent()) {
                CandidateProfile prof = profOpt.get();
                mem.put("name", prof.getName() != null ? prof.getName() : email);
                mem.put("photo", prof.getPhoto());
                mem.put("college", prof.getCollege());
            } else {
                mem.put("name", isLeader ? p.getLeaderName() : email);
                mem.put("photo", isLeader ? p.getLeaderPhoto() : null);
            }
            members.add(mem);
        }
        m.put("members", members);

        return m;
    }

    // ── POST /api/projects/clean-sample-data ──────────────────────────────
    @PostMapping("/clean-sample-data")
    public ResponseEntity<?> cleanSampleData() {
        taskRepo.deleteAll();
        milestoneRepo.deleteAll();
        return ResponseEntity.ok(Map.of("message", "Sample tasks and milestones removed. Only user-added items will appear."));
    }

    private List<String> parseMemberList(String memberEmails) {
        if (memberEmails == null || memberEmails.isBlank()) return new ArrayList<>();
        List<String> list = new ArrayList<>();
        String cleaned = memberEmails.replaceAll("[\\[\\]\"\\s]", "");
        for (String item : cleaned.split(",")) {
            if (!item.isBlank()) list.add(item.trim());
        }
        return list;
    }

    private String listToJson(List<String> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append("\"").append(list.get(i)).append("\"");
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    private String str(Map<String, Object> map, String key) {
        return str(map, key, null);
    }

    private String str(Map<String, Object> map, String key, String defaultValue) {
        Object v = map.get(key);
        return (v != null && !v.toString().isBlank()) ? v.toString() : defaultValue;
    }
}
