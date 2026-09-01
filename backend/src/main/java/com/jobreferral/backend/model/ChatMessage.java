package com.jobreferral.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * A single chat message sent between two teammates.
 * Messages are stored in the DB so chat history persists across sessions/browsers.
 */
@Entity
@Table(name = "chat_messages",
    indexes = {
        @Index(name = "idx_chat_pair", columnList = "from_email, to_email"),
        @Index(name = "idx_chat_sent_at", columnList = "sent_at")
    })
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_email", nullable = false, length = 255)
    private String fromEmail;

    @Column(name = "to_email", nullable = false, length = 255)
    private String toEmail;

    @Column(name = "from_name", length = 255)
    private String fromName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @PrePersist
    public void onCreate() { if (sentAt == null) sentAt = LocalDateTime.now(); }

    // ── Getters & Setters ─────────────────────────────────────────────────

    public Long   getId()                    { return id; }
    public String getFromEmail()             { return fromEmail; }
    public void   setFromEmail(String e)     { this.fromEmail = e; }
    public String getToEmail()               { return toEmail; }
    public void   setToEmail(String e)       { this.toEmail = e; }
    public String getFromName()              { return fromName; }
    public void   setFromName(String n)      { this.fromName = n; }
    public String getText()                  { return text; }
    public void   setText(String t)          { this.text = t; }
    public LocalDateTime getSentAt()         { return sentAt; }
    public void   setSentAt(LocalDateTime t) { this.sentAt = t; }
}
