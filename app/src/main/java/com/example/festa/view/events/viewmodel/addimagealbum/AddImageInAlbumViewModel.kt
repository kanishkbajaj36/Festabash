package com.example.festa.view.events.viewmodel.addimagealbum

import android.app.Activity
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.festa.R
import com.example.festa.utils.Event
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.lifecycle.HiltViewModel
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.observers.DisposableObserver
import io.reactivex.schedulers.Schedulers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.launch
import okhttp3.MultipartBody
import javax.inject.Inject

@ExperimentalCoroutinesApi
@HiltViewModel
class AddImageInAlbumViewModel @Inject constructor(
    application: Application,
    private val repository: AddImgInAlbumRepository
) :
    AndroidViewModel(application) {
    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val addImageInAlbumReponse = MutableLiveData<Event<AddImageInAlbumReponse>>()

    fun getAddImageInAlbum(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        images: MultipartBody.Part,
        album_ids: String
    ) =
        viewModelScope.launch {
            addImageInAlbum(progressDialog, activity,images,album_ids)
        }

    private suspend fun addImageInAlbum(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        images: MultipartBody.Part,
        album_ids: String
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        repository.getAddImageInAlbum(images,album_ids)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<AddImageInAlbumReponse>() {
                override fun onNext(value: AddImageInAlbumReponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    addImageInAlbumReponse.value = Event(value)
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