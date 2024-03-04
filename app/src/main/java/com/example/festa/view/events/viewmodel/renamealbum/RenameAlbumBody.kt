package com.example.festa.view.events.viewmodel.renamealbum

import com.google.gson.annotations.SerializedName

data class RenameAlbumBody(@SerializedName("new_album_name") var new_album_name: String)
