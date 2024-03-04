package com.example.festa.view.events.viewmodel.feedslikedislike

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
import javax.inject.Inject

@ExperimentalCoroutinesApi
@HiltViewModel
class FeedLikeDislikeViewModel @Inject constructor(
    application: Application,
    private val repository: FeedLikeDislikeRepository
) : AndroidViewModel(application) {
    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val feedLikeDislikeResponse = MutableLiveData<Event<FeedLikeDislikeReponse>>()

    fun getFeedLikeDislike(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        feedIds: String,
        userId: String
    ) =
        viewModelScope.launch {
            feedLikeDislike(progressDialog, activity,feedIds,userId)
        }

    private suspend fun feedLikeDislike(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        feedIds: String,
        userId: String
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        repository.getFeedLikeDislike(feedIds,userId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<FeedLikeDislikeReponse>() {
                override fun onNext(value: FeedLikeDislikeReponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    feedLikeDislikeResponse.value = Event(value)
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