package com.example.festa.view.invitedbyanyhost.viewmodel

import android.app.Activity
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.example.festa.R
import com.example.festa.utils.Event
import com.example.festa.view.notifications.notificationmodelview.NotificationRepository
import com.example.festa.view.notifications.notificationmodelview.NotificationResponse
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
class InvitedByPersonModelView @Inject constructor(
    application: Application,
    private val invitedByRepository: InvitedByRepository
) : AndroidViewModel(application) {

    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val mInviteResponse = MutableLiveData<Event<InvitedByResponse>>()

    fun getInvitedBy(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String

    ) =
        viewModelScope.launch {
            getInvite(progressDialog, activity, eventId)
        }

    private suspend fun getInvite(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        invitedByRepository.getNotification(eventId)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<InvitedByResponse>() {
                override fun onNext(value: InvitedByResponse) {
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