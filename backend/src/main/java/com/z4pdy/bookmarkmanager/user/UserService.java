package com.z4pdy.bookmarkmanager.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

	public void register(RegisterUserRequest request) {
        User user = new User(
            request.username(),
            request.email(),
            passwordEncoder.encode(request.password())
        );
        userRepository.save(user);
	}
    
}

