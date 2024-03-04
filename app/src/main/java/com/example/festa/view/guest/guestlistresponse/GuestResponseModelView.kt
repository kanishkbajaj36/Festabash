package com.example.festa.view.guest.guestlistresponse

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
class GuestResponseModelView @Inject constructor(
    application: Application,
    private val notificationRepository: GuestResponseRepository
) : AndroidViewModel(application) {

    val progressIndicator = MutableLiveData<Boolean>()
    val errorResponse = MutableLiveData<Throwable>()
    val mNotificationResponse = MutableLiveData<Event<GuestListUserResponse>>()

    fun getGuestResponse(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String,
        guestBody:GuestResponseBody

    ) =
        viewModelScope.launch {
            getDelete(progressDialog, activity, eventId,guestBody)
        }

    private suspend fun getDelete(
        progressDialog: CustomProgressDialog,
        activity: Activity,
        eventId: String,
        guestBody:GuestResponseBody
    ) {
        progressDialog.start(activity.getString(R.string.please_wait))
        progressIndicator.value = true
        notificationRepository.getGuestResponse(eventId,guestBody)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(object : DisposableObserver<GuestListUserResponse>() {
                override fun onNext(value: GuestListUserResponse) {
                    progressIndicator.value = false
                    progressDialog.stop()
                    mNotificationResponse.value = Event(value)
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