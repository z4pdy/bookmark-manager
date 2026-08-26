package com.z4pdy.bookmarkmanager.user;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> get(String username) {
        return userRepository.findByUsername(username);
    }

	@Override
	public UserPrincipal loadUserByUsername(String login) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(login).orElseThrow(() ->
            new UsernameNotFoundException(login)
        );

        return new UserPrincipal(user.getId(), user.getUsername(), user.getPassword());
	}

    @Transactional
	public void updateIsPublic(Long id, boolean isPublic) {
        User user = userRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + id)
        );
        user.setIsPublic(isPublic);
	}
}

