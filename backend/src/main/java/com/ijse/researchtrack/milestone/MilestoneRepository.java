package com.ijse.researchtrack.milestone;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, String> {
    List<Milestone> findByProjectId(String projectId);

    List<Milestone> findByProjectIdAndIsCompleted(String projectId, Boolean isCompleted);
}
