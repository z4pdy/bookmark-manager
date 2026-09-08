package com.z4pdy.bookmarkmanager;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.server.ResponseStatusException;

import com.z4pdy.bookmarkmanager.user.User;
import com.z4pdy.bookmarkmanager.user.UserPrincipal;
import com.z4pdy.bookmarkmanager.user.UserRepository;
import com.z4pdy.bookmarkmanager.user.UserService;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserService userService;

    @Test
    void shouldThrowExceptionWhenUserDoesNotExistWhileLoading() {
        when(userRepository.findByUsernameOrEmail("not-existing-username")).thenReturn(Optional.empty());
        assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername("not-existing-username"));
    }

    @Test
    void shouldLoadUserByUsername() {
        User user = new User("username", "email", "password");
        when(userRepository.findByUsernameOrEmail("username")).thenReturn(Optional.of(user));
        UserPrincipal result = userService.loadUserByUsername("username");
        
        assertEquals(user.getUsername(), result.getUsername());
    }

    @Test
    void shouldLoadUserByEmail() {
        User user = new User("username", "email", "password");
        when(userRepository.findByUsernameOrEmail("email")).thenReturn(Optional.of(user));
        UserPrincipal result = userService.loadUserByUsername("email");
        
        assertEquals(user.getUsername(), result.getUsername());
    }

    @Test
    void shouldThrowExceptionWhenUserDoesNotExistWhileUpdatingIsPublic() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> userService.updateIsPublic(1L, true));
    }

    @Test
    void shouldUpdateIsPublic() {
        User user = new User("username", "email", "password");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        userService.updateIsPublic(1L, false);
        assertFalse(user.isPublic());
    }
}
