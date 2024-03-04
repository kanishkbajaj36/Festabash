package com.example.festa.interfaces

interface OnItemClickListenerDeleteImage {
    fun onDeleteImageClick(position: Int, image_Id: String, album_ids: String?)

    fun onAddCommentClick(feedId: String)

    fun onLikeDislikeClick(feedId: String)
    fun onFeedDeleteClick(feedId: String)
}