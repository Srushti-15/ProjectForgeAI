package com.jobreferral.backend.controller;

import com.jobreferral.backend.config.JwtUtil;
import com.jobreferral.backend.model.Student;
import com.jobreferral.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ── POST /api/auth/register ─────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> body) {
        String email = body.get("email").toLowerCase().trim();
        String name  = body.get("name");
        String password       = body.get("password");
        String college        = body.get("college");
        String course         = body.get("course");
        String graduationYear = body.get("graduationYear");

        // Block admin email from registering
        if ("admin@gmail.com".equals(email)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "The email address 'admin@gmail.com' is reserved and cannot be registered.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
        }

        // Check duplicate
        if (studentRepository.existsByEmail(email)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "An account with this email address already exists.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
        }

        // Save student with hashed password
        Student student = Student.builder()
                .fullName(name)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .college(college)
                .course(course)
                .graduationYear(graduationYear)
                .role("candidate")
                .build();

        studentRepository.save(student);

        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Registration successful! Please sign in using your credentials.");
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    // ── POST /api/auth/login ────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email").toLowerCase().trim();
        String password = body.get("password");

        Optional<Student> optStudent = studentRepository.findByEmail(email);

        if (optStudent.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Invalid email or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        Student student = optStudent.get();

        if (!passwordEncoder.matches(password, student.getPasswordHash())) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", "Invalid email or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        String token = jwtUtil.generateToken(student.getEmail(), student.getRole());

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("email", student.getEmail());
        resp.put("fullName", student.getFullName());
        resp.put("name", student.getFullName());
        resp.put("college", student.getCollege());
        resp.put("course", student.getCourse());
        resp.put("graduationYear", student.getGraduationYear());
        resp.put("role", student.getRole());
        return ResponseEntity.ok(resp);
    }
}
