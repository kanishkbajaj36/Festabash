package com.example.festa.view.events.viewmodel.renamealbum

import com.example.festa.services.ApiServices
import com.example.festa.view.events.viewmodel.addimagealbum.AddImageInAlbumReponse
import io.reactivex.Observable
import javax.inject.Inject

class RenameAlbumNameRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getRenameAlbumName(album_ids: String, renameAlbumBody: RenameAlbumBody): Observable<AddImageInAlbumReponse>
    {
        return apiService.renameAlbumName(album_ids,renameAlbumBody)
    }
}