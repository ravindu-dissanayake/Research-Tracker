package com.ijse.researchtrack.user;

import com.ijse.researchtrack.common.ResourceNotFoundException;
import com.ijse.researchtrack.common.UnauthorizedException;
import com.ijse.researchtrack.common.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return new UserDTO(user);
    }

    public UserDTO getUserById(String id, String currentUserId, UserRole currentUserRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (currentUserRole != UserRole.ADMIN && !user.getId().equals(currentUserId)) {
            throw new UnauthorizedException("You don't have permission to view this user profile");
        }

        return new UserDTO(user);
    }

    public User getUserEntityById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public UserDTO createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser);
    }

    public UserDTO createUser(String username, String password, String fullName, UserRole role) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole(role);

        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser);
    }

    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public UserDTO updateUserRole(String id, UserRole role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setRole(role);
        User updatedUser = userRepository.save(user);
        return new UserDTO(updatedUser);
    }

    public UserDTO updateProfile(String id, UpdateProfileRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setFullName(request.getFullName());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return new UserDTO(updatedUser);
    }
}
