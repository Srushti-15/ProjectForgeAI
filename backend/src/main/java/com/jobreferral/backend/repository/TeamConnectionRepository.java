package com.jobreferral.backend.repository;

import com.jobreferral.backend.model.TeamConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeamConnectionRepository extends JpaRepository<TeamConnection, Long> {

    /** All pending invites sent TO this user (inbox). */
    List<TeamConnection> findByToEmailAndStatus(String toEmail, String status);

    /** Check if an invite already exists from → to (any status). */
    Optional<TeamConnection> findByFromEmailAndToEmail(String fromEmail, String toEmail);

    /**
     * All accepted connections where the given email is EITHER the sender OR receiver.
     * Used to build the teammate list for both parties after acceptance.
     */
    @Query("SELECT c FROM TeamConnection c WHERE c.status = 'accepted' AND (c.fromEmail = :email OR c.toEmail = :email)")
    List<TeamConnection> findAcceptedConnectionsForUser(@Param("email") String email);

    /** All invites sent BY this user (to know which ones are already invited). */
    List<TeamConnection> findByFromEmail(String fromEmail);
}
