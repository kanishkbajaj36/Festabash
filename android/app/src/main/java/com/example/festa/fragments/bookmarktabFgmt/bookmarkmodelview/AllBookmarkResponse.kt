package com.example.festa.fragments.bookmarktabFgmt.bookmarkmodelview

import com.example.festa.ui.theme.bookmark.model.BookMarkGetResponse.AllCollection
import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import java.io.Serializable


class AllBookmarkResponse {
    @SerializedName("success")
    @Expose
    var success: Boolean? = null

    @SerializedName("message")
    @Expose
    var message: String? = null

    @SerializedName("allCollections")
    @Expose
    var allCollections: List<AllCollection>? = null

    inner class AllCollection : Serializable
    {
        @SerializedName("collection_id")
        @Expose
        var collectionId: String? = null

        @SerializedName("collection_name")
        @Expose
        var collectionName: String? = null

        @SerializedName("collection_created_date")
        @Expose
        var collectionCreatedDate: String? = null

        @SerializedName("collection_entries_count")
        @Expose
        var collectionEntriesCount: Int? = null
    }
}