package com.z4pdy.bookmarkmanager.user;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

	public void register(RegisterUserRequest request) {
        User user = new User(
            request.username(),
            request.email(),
            request.password()
        );
        userRepository.save(user);
	}
    
}

