package com.z4pdy.bookmarkmanager.user;

import java.util.Collection;
import java.util.List;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserPrincipal implements UserDetails {
    private final Long id;
    private final String username;
    private final String password;

    public UserPrincipal(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
    
    public Long getId() {
        return id;
    }

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
	}

	@Override
	public @Nullable String getPassword() {
        return password;
	}

	@Override
	public String getUsername() {
        return username;
	}
}
