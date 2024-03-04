package com.example.festa.view.events.viewmodel.deleteimgfromalbum

import android.app.Activity
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.festa.R
import com.example.festa.utils.Event
import com.example.festa.view.events.viewmodel.addimagealbum.AddImageInAlbumReponse
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.lifecycle.HiltViewModel
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.observers.DisposableObserver
import io.reactivex.schedulers.Schedulers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.launch
import javax.inject.Inject

@ExperimentalCoroutinesApi
@HiltViewModel
class DeleteImageFromAlbumViewModel @Inject constructor(
    application: Application,
    private val repository: DeleteImageFromAlbumRepository
) :
    AndroidViewModel(application) {
    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val deleteImageFromAlbumResponse = MutableLiveData<Event<AddImageInAlbumReponse>>()

    fun getDeleteImgFromAlbum(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        image_Ids: String,
        album_id: String
    ) =
        viewModelScope.launch {
            deleteImgFromAlbum(progressDialog, activity,image_Ids,album_id)
        }

    private suspend fun deleteImgFromAlbum(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        image_Ids: String,
        album_id: String) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        repository.getDeleteImgFromAlbum(image_Ids,album_id)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<AddImageInAlbumReponse>() {
                override fun onNext(value: AddImageInAlbumReponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    deleteImageFromAlbumResponse.value = Event(value)
                }

                override fun onError(e: Throwable) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    errorResponse.value = e
                }

                override fun onComplete() {
                    progressDialog.stop()
                    progressIndicator.value = false
                }
            })
    }
}