package com.z4pdy.bookmarkmanager.user;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

	@Override
	public UserPrincipal loadUserByUsername(String login) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(login).orElseThrow(() ->
            new UsernameNotFoundException(login)
        );

        return new UserPrincipal(user.getId(), user.getUsername(), user.getPassword());
	}
}

