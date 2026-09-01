package com.jobreferral.backend.repository;

import com.jobreferral.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * Fetch the full conversation between two users, in chronological order.
     * The query matches regardless of who sent vs. received (bidirectional).
     */
    @Query("""
        SELECT m FROM ChatMessage m
        WHERE (m.fromEmail = :e1 AND m.toEmail = :e2)
           OR (m.fromEmail = :e2 AND m.toEmail = :e1)
        ORDER BY m.sentAt ASC
        """)
    List<ChatMessage> findConversation(@Param("e1") String e1, @Param("e2") String e2);
}
