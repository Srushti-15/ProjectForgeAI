package com.jobreferral.backend.repository;

import com.jobreferral.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    /**
     * Find all projects where the given candidate email is either the team leader
     * or listed as an enrolled team member.
     */
    @Query("SELECT p FROM Project p WHERE p.leaderEmail = :email OR p.memberEmails LIKE CONCAT('%', :email, '%') ORDER BY p.createdAt DESC")
    List<Project> findProjectsForUser(@Param("email") String email);
}
