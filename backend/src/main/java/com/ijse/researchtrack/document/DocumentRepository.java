package com.ijse.researchtrack.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, String> {
    List<Document> findByProjectId(String projectId);

    List<Document> findByUploadedById(String uploadedById);
}
