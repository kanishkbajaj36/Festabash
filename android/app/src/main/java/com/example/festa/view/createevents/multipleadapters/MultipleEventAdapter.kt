package com.example.festa.view.createevents.multipleadapters

import android.app.Dialog
import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.festa.interfaces.OnItemClickListenerDelete
import com.example.festa.R
import com.example.festa.view.createevents.viewmodel.getedit.GetEditResponse
import com.example.festa.view.subeventsupdate.ui.SubEventActivity

class MultipleEventAdapter(
    private val required: Context,
    private var addMultipleEventList: List<GetEditResponse.VenueDateAndTime>,
    private val itemClickListener: OnItemClickListenerDelete,
    private val eventId: String
) :
    RecyclerView.Adapter<MultipleEventAdapter.ViewHolder>() {

    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val titleName: TextView = itemView.findViewById(R.id.titleName)
        val eventName: TextView = itemView.findViewById(R.id.eventName)
        val eventLocationTxt: TextView = itemView.findViewById(R.id.eventLocationTxt)
        val eventDate: TextView = itemView.findViewById(R.id.eventDate)
        val eventStartTime: TextView = itemView.findViewById(R.id.eventStartTime)
        val eventEndTime: TextView = itemView.findViewById(R.id.eventEndTime)
        val deleteEvent: ImageView = itemView.findViewById(R.id.deleteEvent)
        val editEventBtn: ImageView = itemView.findViewById(R.id.editEventBtn)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView = LayoutInflater.from(parent.context)
            .inflate(R.layout.add_multiple_event_layout, parent, false)
        return ViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val person = addMultipleEventList[position]
        holder.titleName.text = person.subEventTitle
        holder.eventName.text = person.venueName
        holder.eventLocationTxt.text = person.venueLocation
        holder.eventDate.text = person.date
        holder.eventStartTime.text = person.startTime
        holder.eventEndTime.text = person.endTime

        holder.editEventBtn.setOnClickListener {
            val subEventId = person.id.toString()
            val subTitle = person.subEventTitle.toString()
            val eventName = person.venueName.toString()
            val eventLocationTxt = person.venueLocation.toString()
            val eventDate = person.date.toString()
            val eventStartTime = person.startTime.toString()
            val eventEndTime = person.endTime.toString()
            val intent = Intent(required, SubEventActivity::class.java)
            intent.putExtra("subEventId", subEventId)
            intent.putExtra("subTitle", subTitle)
            intent.putExtra("eventName", eventName)
            intent.putExtra("eventLocationTxt", eventLocationTxt)
            intent.putExtra("eventDate", eventDate)
            intent.putExtra("eventStartTime", eventStartTime)
            intent.putExtra("eventEndTime", eventEndTime)
            intent.putExtra("eventId", eventId)
            required.startActivity(intent)
        }

        holder.deleteEvent.setOnClickListener {
            val logoutDialog = Dialog(required)
            logoutDialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
            logoutDialog.setContentView(R.layout.delete_sub_event_layout)
            val noDialog = logoutDialog.findViewById<LinearLayout>(R.id.noDialog)
            val yesDialog = logoutDialog.findViewById<LinearLayout>(R.id.yesDialog)

            val guestId = person.id.toString()

            val window = logoutDialog.window
            window!!.setLayout(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            yesDialog.setOnClickListener {
                itemClickListener.onDeleteClick(position, guestId)
                logoutDialog.dismiss()
            }

            noDialog.setOnClickListener { logoutDialog.dismiss() }

            logoutDialog.show()
        }
    }

    override fun getItemCount(): Int {
        return addMultipleEventList.size
    }
}

