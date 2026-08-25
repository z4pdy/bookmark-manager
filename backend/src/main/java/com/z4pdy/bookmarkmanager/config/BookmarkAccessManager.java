package com.z4pdy.bookmarkmanager.config;

import org.springframework.stereotype.Component;

import com.z4pdy.bookmarkmanager.user.User;
import com.z4pdy.bookmarkmanager.user.UserService;

import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.authorization.AuthorizationResult;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;

import java.util.Optional;
import java.util.function.Supplier;

@Component
public class BookmarkAccessManager implements AuthorizationManager<RequestAuthorizationContext> {
    private final UserService userService;

    public BookmarkAccessManager(UserService profileService) {
        this.userService = profileService;
    }

	@Override
	public AuthorizationResult authorize(Supplier<? extends @Nullable Authentication> authentication, RequestAuthorizationContext context) {
        String username = context.getVariables().get("username");
        Optional<User> optionalUser = userService.get(username);
        if (optionalUser.isEmpty()) {
            return new AuthorizationDecision(true);
            // allow the request to reach BookmarkController so BookmarkService can return an HTTP 404 status
        }
        User user = optionalUser.get();

        if (user.isPublic()) {
            return new AuthorizationDecision(true);
        }

        Authentication auth = authentication.get();
        if (auth != null && auth.isAuthenticated()) {
            Long authUserId = (Long) auth.getPrincipal();
            if (user.getId().equals(authUserId)) {
                return new AuthorizationDecision(true);
            }
        }

        return new AuthorizationDecision(false);
	}
}
