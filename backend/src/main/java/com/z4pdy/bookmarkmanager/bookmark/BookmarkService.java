package com.z4pdy.bookmarkmanager.bookmark;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookmarkService {
    private final BookmarkRepository bookmarkRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository) {
        this.bookmarkRepository = bookmarkRepository;
    }

    public List<Bookmark> getAll() {
        return bookmarkRepository.findAll();
    }

	public void create(CreateBookmarkRequest request) {
        Bookmark bookmark = new Bookmark();
        bookmark.setCategory(request.category());
        bookmark.setTitle(request.title());
        bookmark.setUrl(request.url());
        bookmarkRepository.save(bookmark);
	}
    
}
