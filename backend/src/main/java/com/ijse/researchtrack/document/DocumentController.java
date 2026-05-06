package com.ijse.researchtrack.document;

import com.ijse.researchtrack.common.UserRole;
import com.ijse.researchtrack.config.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DocumentController {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/projects/{projectId}/documents")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByProjectId(@PathVariable String projectId) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        List<DocumentDTO> documents = documentService.getDocumentsByProjectId(projectId, currentUser.getId(), role);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/documents")
    public ResponseEntity<List<DocumentDTO>> getAllDocuments() {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        List<DocumentDTO> documents = documentService.getAllDocuments(currentUser.getId(), role);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/documents/{id}")
    public ResponseEntity<DocumentDTO> getDocumentById(@PathVariable String id) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        DocumentDTO document = documentService.getDocumentById(id, currentUser.getId(), role);
        return ResponseEntity.ok(document);
    }

    @PostMapping("/projects/{projectId}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI', 'MEMBER')")
    public ResponseEntity<DocumentDTO> createDocument(@PathVariable String projectId,
            @Valid @RequestBody DocumentRequest request) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);
        DocumentDTO document = documentService.createDocument(projectId, request, currentUser.getId(), role);
        return ResponseEntity.status(HttpStatus.CREATED).body(document);
    }

    @DeleteMapping("/documents/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PI')")
    public ResponseEntity<Void> deleteDocument(@PathVariable String id) {
        UserDetailsImpl currentUser = getCurrentUser();
        UserRole role = getUserRole(currentUser);

        documentService.deleteDocument(id, currentUser.getId(), role);
        return ResponseEntity.noContent().build();
    }

    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }

    private UserRole getUserRole(UserDetailsImpl userDetails) {
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        return UserRole.valueOf(role.replace("ROLE_", ""));
    }
}
