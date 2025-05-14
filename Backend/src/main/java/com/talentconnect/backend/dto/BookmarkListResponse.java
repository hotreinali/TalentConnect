package com.talentconnect.backend.dto;

import java.util.List;

public class BookmarkListResponse {
    private List<BookmarkSummary> bookmarks;

    public BookmarkListResponse() {}

    public BookmarkListResponse(List<BookmarkSummary> bookmarks) {
        this.bookmarks = bookmarks;
    }

    public List<BookmarkSummary> getBookmarks() {
        return bookmarks;
    }

    public void setBookmarks(List<BookmarkSummary> bookmarks) {
        this.bookmarks = bookmarks;
    }
}
