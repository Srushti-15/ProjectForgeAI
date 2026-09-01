package com.jobreferral.backend.repository;

import com.jobreferral.backend.model.ProjectMilestone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestone, Long> {

    List<ProjectMilestone> findByProjectIdOrderByCreatedAtAsc(Long projectId);
}
