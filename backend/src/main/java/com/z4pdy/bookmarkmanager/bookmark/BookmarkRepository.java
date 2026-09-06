package com.z4pdy.bookmarkmanager.bookmark;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.z4pdy.bookmarkmanager.user.User;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUser(User user);
    List<Bookmark> findByCategory(String category);

    @Modifying
    @Query("UPDATE Bookmark b SET b.category = :newCategory WHERE b.user.id = :userId AND b.category = :category")
    void renameCategory(Long userId, String category, String newCategory);
}
