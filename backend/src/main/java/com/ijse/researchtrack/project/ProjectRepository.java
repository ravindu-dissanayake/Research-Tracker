package com.ijse.researchtrack.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findByPiId(String piId);

    List<Project> findByStatus(com.ijse.researchtrack.common.ProjectStatus status);
}
