package com.z4pdy.bookmarkmanager.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.username = :login OR u.email = :login")
	Optional<User> findByUsernameOrEmail(String login);

    @Query("SELECT u.isPublic FROM User u WHERE u.username = :username")
    boolean getIsPublicByUsername(String username);

	boolean existsByUsername(String username);

	boolean existsByEmail(String email);
}
