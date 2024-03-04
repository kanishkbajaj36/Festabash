package com.example.festa.view.events.viewmodel.deletealbum

import com.example.festa.services.ApiServices
import com.example.festa.view.events.viewmodel.addimagealbum.AddImageInAlbumReponse
import io.reactivex.Observable
import javax.inject.Inject

class DeleteAlbumRepository @Inject constructor(private val apiService: ApiServices) {
    suspend fun getDeleteAlbum(album_id: String): Observable<AddImageInAlbumReponse> {
        return apiService.deleteAlbum(album_id)
    }
}