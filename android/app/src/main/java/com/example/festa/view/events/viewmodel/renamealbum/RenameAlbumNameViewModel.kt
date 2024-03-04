package com.example.festa.view.events.viewmodel.renamealbum

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
class RenameAlbumNameViewModel @Inject constructor(
    application: Application,
    private val repository: RenameAlbumNameRepository
) : AndroidViewModel(application) {
    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val renameAlbumNameResponse = MutableLiveData<Event<AddImageInAlbumReponse>>()

    fun getRenameAlbumName(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        album_ids: String,
        renameAlbumBody: RenameAlbumBody
    ) =
        viewModelScope.launch {
            renameAlbumName(progressDialog, activity,album_ids,renameAlbumBody)
        }

    private suspend fun renameAlbumName(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        album_ids: String,
        renameAlbumBody: RenameAlbumBody
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        repository.getRenameAlbumName(album_ids,renameAlbumBody)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<AddImageInAlbumReponse>() {
                override fun onNext(value: AddImageInAlbumReponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    renameAlbumNameResponse.value = Event(value)
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