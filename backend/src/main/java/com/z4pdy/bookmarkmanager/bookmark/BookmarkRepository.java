package com.z4pdy.bookmarkmanager.bookmark;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.z4pdy.bookmarkmanager.user.User;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUser(User user);
}
