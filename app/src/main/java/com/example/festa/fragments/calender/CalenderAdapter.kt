package com.example.festa.fragments.calender

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.fragment.app.FragmentManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.fragments.calender.modelview.CalenderResponse
import com.example.festa.view.createevents.ui.CreateEventFragment
import com.example.festa.view.events.ui.EventListDetailsActivity
import com.example.festa.view.guest.ui.GuestActivity
import de.hdodenhof.circleimageview.CircleImageView
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*

class CalenderAdapter(
    private val activity: Context,
    private val supportFragmentManager: FragmentManager,
    private var eventList: List<CalenderResponse.AllEvent>
) : RecyclerView.Adapter<CalenderAdapter.ViewHolder>() {
    var eventId = ""

    //  var isset: Boolean = false
    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        // Define your views here
        val eventlinearbg: LinearLayout = itemView.findViewById(R.id.eventlinearbg)
        val seemore: LinearLayout = itemView.findViewById(R.id.seemorelinear)
        val seeless: LinearLayout = itemView.findViewById(R.id.seelesslinear)
        val seemoreicon: ImageView = itemView.findViewById(R.id.seemoreicon)
        val seelessicon: ImageView = itemView.findViewById(R.id.seelessicon)
        //val chat: ImageView = itemView.findViewById(R.id.msg)
        val feed: ImageView = itemView.findViewById(R.id.feed)
        val feed1: ImageView = itemView.findViewById(R.id.feed1)
        val guestlg: ImageView = itemView.findViewById(R.id.guestuser)
        val editBtn: ImageView = itemView.findViewById(R.id.editBtn)
        val clickEditBtn: ImageView = itemView.findViewById(R.id.clickView)
        val guestListBtn: ImageView = itemView.findViewById(R.id.guestListBtn)
        val eventNameElist: TextView = itemView.findViewById(R.id.EventNameElist)
        val eventNameMorelist: TextView = itemView.findViewById(R.id.EventNameMorelist)
        val eventLocElist: TextView = itemView.findViewById(R.id.EventLocElist)
        val eventLocMorelist: TextView = itemView.findViewById(R.id.EventLocMorelist)
        val eventDescMorelist: TextView = itemView.findViewById(R.id.EventDescMorelist)
        val dateElist: TextView = itemView.findViewById(R.id.DateElist)
        val dateMorelist: TextView = itemView.findViewById(R.id.DateMorelist)
        val timeElist: TextView = itemView.findViewById(R.id.TimeElist)
        val timeMorelist: TextView = itemView.findViewById(R.id.TimeMorelist)
        val profileimg: CircleImageView = itemView.findViewById(R.id.profileimg)
        val profileimg1: CircleImageView = itemView.findViewById(R.id.profileimg1)
    }

    // create new views
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view =
            LayoutInflater.from(parent.context).inflate(R.layout.eventlist_layout, parent, false)
        return ViewHolder(view)
    }

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        // val ItemsViewModel = mList[position]
        if (position % 2 == 0) {
            holder.eventlinearbg.setBackgroundResource(R.drawable.borderradious)// Even position
        } else {
            //  holder.linearReqBackground.setBackgroundColor(Color.parseColor("#FDF2D6")) // Odd position
            holder.eventlinearbg.setBackgroundResource(R.drawable.borderradiousy) // Odd position
        }

        val event = eventList[position]
        val venueDateAndTime =
            event.venueDateAndTime?.getOrNull(0) // Assuming you want the first item from the list
        var eventName = ""
        var eventLocation = ""
        var eventDate = ""
        var eventTime = ""
        var eventDesp = event.description

        eventName = event.title.toString()
        if (venueDateAndTime != null) {
            // The list is not null and not empty
            eventLocation = venueDateAndTime.venueLocation.toString()
            eventDate = venueDateAndTime.date.toString()
            eventTime = venueDateAndTime.startTime.toString()
            eventDesp = event.description

            holder.dateElist.text = eventDate
            holder.eventNameElist.text = eventName
            holder.eventLocElist.text = eventLocation

            if (isDateFormatValid(eventDate)) {
                dateChange(eventDate, holder.dateElist, holder.timeElist)
            }
            // Use the values for further operations
        } else {
            println("No data at position 0 or venueDateAndTime is null or empty")
        }


        // Assuming that the images array contains at least one image filename
        val imageUrl = "http://13.51.205.211:6002/${event.images!!.firstOrNull()}"
        val eventTypeData = event.eventTypeName

        if (eventTypeData == 1) {
            holder.editBtn.visibility = View.VISIBLE
            holder.guestListBtn.visibility = View.VISIBLE

        } else {
            holder.editBtn.visibility = View.GONE
            holder.guestListBtn.visibility = View.GONE
        }


        Glide.with(activity).load(imageUrl)
            .placeholder(R.drawable.partypic) // Placeholder image while loading
            .into(holder.profileimg)

        holder.eventNameElist.text = eventName
        holder.timeElist.text = "- $eventTime"

        holder.seemoreicon.setOnClickListener {
            holder.seeless.visibility = View.GONE
            holder.seemore.visibility = View.VISIBLE
            holder.eventNameMorelist.text = eventName
            holder.eventLocMorelist.text = eventLocation
            holder.timeMorelist.text = "- $eventTime"
            holder.dateMorelist.text = eventDate
            holder.eventDescMorelist.text = eventDesp

            Glide.with(activity).load(imageUrl)
                .placeholder(R.drawable.partypic) // Placeholder image while loading
                .into(holder.profileimg1)
        }

        holder.seelessicon.setOnClickListener {
            holder.seeless.visibility = View.VISIBLE
            holder.seemore.visibility = View.GONE
        }

        holder.feed.setOnClickListener {
            val eventIds = event.id
            Festa.encryptedPrefs.eventIds = eventIds.toString()

            val intent = Intent(activity, EventListDetailsActivity::class.java)
            activity.startActivity(intent)
        }

        holder.guestlg.setOnClickListener {
            val intent = Intent(activity, GuestActivity::class.java)
            intent.putExtra("eventId", eventId)
            activity.startActivity(intent)
        }

        holder.editBtn.setOnClickListener {
            val eventId = event.id!!
            val bundle = Bundle()
            Festa.encryptedPrefs.eventIds = eventId
            bundle.putString(
                "eventId", eventId
            ) // Replace 'eventId' with the actual variable holding the event ID
            bundle.putString(
                "adapter", "adapterValue"
            ) // Replace 'eventId' with the actual variable holding the event ID
            Log.e("hellofd", "event: $eventId")
            val guestFragment = CreateEventFragment()
            guestFragment.arguments = bundle
            val transaction = supportFragmentManager.beginTransaction()
            transaction.replace(R.id.containers, guestFragment)
            transaction.addToBackStack(null) // Add to back stack to allow navigating back
            transaction.commit()
        }

        holder.clickEditBtn.setOnClickListener {
            val eventId = event.id!!
            val bundle = Bundle()
            Festa.encryptedPrefs.eventIds = eventId
            bundle.putString(
                "eventId", eventId
            ) // Replace 'eventId' with the actual variable holding the event ID
            bundle.putString(
                "adapter", "adapterValue"
            ) // Replace 'eventId' with the actual variable holding the event ID
            Log.e("hellofd", "event: $eventId")
            val guestFragment = CreateEventFragment()
            guestFragment.arguments = bundle
            val transaction = supportFragmentManager.beginTransaction()
            transaction.replace(R.id.containers, guestFragment)
            transaction.addToBackStack(null) // Add to back stack to allow navigating back
            transaction.commit()
        }

        holder.feed1.setOnClickListener {
            val eventIds = event.id
            Festa.encryptedPrefs.eventIds = eventIds.toString()

            val intent = Intent(activity, EventListDetailsActivity::class.java)
            activity.startActivity(intent)
        }

        holder.guestListBtn.setOnClickListener {
            val intent = Intent(activity, GuestActivity::class.java)
            intent.putExtra("eventId", eventId)
            activity.startActivity(intent)
        }
    }

    override fun getItemCount(): Int {
        return eventList.size
    }

    private fun  dateChange(eventDate: String, dateElist: TextView, timeElist: TextView) {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())

        // Parse the input date string to obtain a Date object
        val date = inputFormat.parse(eventDate)

        // Create a SimpleDateFormat object to format the date as "dd MMM, yyyy"
        val outputDateFormat = SimpleDateFormat("dd MMM, yyyy", Locale.getDefault())

        // Format the date
        val formattedDate = outputDateFormat.format(date)

        // Create a SimpleDateFormat object to format the time as "hh:mm a"
        val outputTimeFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())

        // Format the time
        val formattedTime = outputTimeFormat.format(date)

        // Set the formatted date and time to the TextViews
        dateElist.text = formattedDate
        timeElist.text = "-$formattedTime"
    }

    private fun isDateFormatValid(dateString: String): Boolean {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        dateFormat.isLenient = false // Disable lenient parsing
        return try {
            dateFormat.parse(dateString)
            true // Date string matches the specified format
        } catch (e: Exception) {
            false // Date string does not match the specified format
        }
    }
}
