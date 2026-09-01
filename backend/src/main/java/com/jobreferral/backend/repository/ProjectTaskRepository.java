package com.jobreferral.backend.repository;

import com.jobreferral.backend.model.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectTaskRepository extends JpaRepository<ProjectTask, Long> {

    List<ProjectTask> findByProjectIdOrderByCreatedAtAsc(Long projectId);

    long countByProjectId(Long projectId);

    long countByProjectIdAndStatus(Long projectId, String status);

    List<ProjectTask> findByMilestoneId(Long milestoneId);
}
