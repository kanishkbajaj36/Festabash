package com.example.festa.fragments.bookmarktabFgmt.bookmarkmodelview

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
class AllBookmarkModelView @Inject constructor(
    application: Application,
    private val invitedByRepository: AllBookMarkRepository
) : AndroidViewModel(application) {

    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val mInviteResponse = MutableLiveData<Event<AllBookmarkResponse>>()

    fun getAllBookmark(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        userId: String

    ) =
        viewModelScope.launch {
            getBookmark(progressDialog, activity, userId)
        }

    private suspend fun getBookmark(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        userId: String
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        invitedByRepository.getFilterCity(userId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<AllBookmarkResponse>() {
                override fun onNext(value: AllBookmarkResponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    mInviteResponse.value = Event(value)
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