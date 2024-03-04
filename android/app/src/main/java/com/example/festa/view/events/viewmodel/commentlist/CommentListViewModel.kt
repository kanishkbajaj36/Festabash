package com.example.festa.view.events.viewmodel.commentlist

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
class CommentListViewModel @Inject constructor(
    application: Application,
    private val repository: CommentListRepository
) :
    AndroidViewModel(application) {
    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val commentListResponse = MutableLiveData<Event<CommentListResponse>>()

    fun allCommentLists(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        feedIds: String
    ) =
        viewModelScope.launch {
            allCommentList(progressDialog, activity,feedIds)
        }

    private suspend fun allCommentList(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        feedIds: String
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        repository.allCommentLists(feedIds)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<CommentListResponse>() {
                override fun onNext(value: CommentListResponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    commentListResponse.value = Event(value)
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