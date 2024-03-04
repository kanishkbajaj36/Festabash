package com.example.festa.view.createevents.ui


import android.annotation.SuppressLint
import android.app.*
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.drawable.ColorDrawable
import android.icu.util.Calendar
import android.location.Address
import android.location.Geocoder
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.text.Editable
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import android.widget.Toast.makeText
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.festa.R
import com.example.festa.application.Festa
import com.example.festa.databinding.FragmentCreateEventBinding
import com.example.festa.interfaces.OnItemClickListenerDelete
import com.example.festa.location.LocationActivity
import com.example.festa.view.cohost.ui.CoHostActivity
import com.example.festa.view.createevents.multipleadapters.MultipleEventAdapter
import com.example.festa.view.createevents.multipleeventsharepre.customclass.CreateMultipleEventModel
import com.example.festa.view.createevents.viewmodel.createevent.CreateEventViewModel
import com.example.festa.view.createevents.viewmodel.createfinal.CreateFinalEventViewModel
import com.example.festa.view.createevents.viewmodel.createmutiple.CreateMultiEventModel
import com.example.festa.view.createevents.viewmodel.deletesubevent.DeleteSubEventModel
import com.example.festa.view.createevents.viewmodel.getedit.GetEditModel
import com.example.festa.view.createevents.viewmodel.getedit.GetEditResponse
import com.example.festa.view.createevents.viewmodel.sendinvite.SendInviteModel
import com.example.festa.view.events.ui.EventListFragment
import com.example.festa.view.guest.ui.GuestActivity
import com.freqwency.promotr.utils.ErrorUtil
import com.google.android.gms.maps.model.LatLng
import com.google.gson.Gson
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.File
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*

@AndroidEntryPoint
class CreateEventFragment : Fragment(), OnItemClickListenerDelete {
    private lateinit var activity: Activity
    private val createEventViewModel: CreateEventViewModel by viewModels()
    private val createFinalEventViewModel: CreateFinalEventViewModel by viewModels()
    private val createMultiEventViewModel: CreateMultiEventModel by viewModels()
    private val deleteEventViewModel: DeleteSubEventModel by viewModels()
    private val sendInviteModel: SendInviteModel by viewModels()
    private val progressDialog by lazy { CustomProgressDialog(requireActivity()) }
    private val getEditModel: GetEditModel by viewModels()

    private val eventlist = ArrayList<String>()
    private val strEventlist = ArrayList<String>()

    private lateinit var venueNamePopUp: EditText
    private lateinit var venueTitlePopUp: EditText
    private lateinit var venueLocationPopUp: EditText
    private lateinit var venueDatePopUp: TextView
    private lateinit var venueStartTimePopUp: TextView
    private lateinit var venueEndTimePopUp: TextView
    private val PLACE_PICKUP_REQUEST_CODE = 1001
    var userId = ""
    var eventId = ""
    private var strCityName = ""

    private var indexOfLocation = -1
    private lateinit var item: String
    private var strPopUpdate: String = ""
    private var strStartTimePOpUp: String = ""
    private var strEnddTimePOpUp: String = ""
    private var strStartTime: String = ""
    private var strEndTime: String = ""

    private var strEventTitle: String = ""
    private var strEventDescription: String = ""
    private var strEndTimePoppp: String = ""
    private var singleOrMultArrayString: String? = null
    private var event_key = 1

    lateinit var dialog: Dialog

    private var _binding: FragmentCreateEventBinding? = null
    private val binding get() = _binding!!

    // Add Guest Name and Phone number
    private var personList = mutableListOf<CreateMultipleEventModel>()
    private var multipleAdapter: MultipleEventAdapter? = null


    //Select Multple Image
    companion object {
        private const val REQUEST_IMAGE_PICK = 100
    }

    private val selectedImages: ArrayList<File> = ArrayList()
    private var outputList = ArrayList<String>()
    private var eventType = ""
    private var strCheckBtn = ""

    private var guestList: List<GetEditResponse.VenueDateAndTime> = ArrayList()

    @RequiresApi(Build.VERSION_CODES.N)
    @SuppressLint(
        "MissingInflatedId",
        "ResourceAsColor",
        "SetTextI18n",
        "UseRequireInsteadOfGet",
        "SuspiciousIndentation"
    )
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCreateEventBinding.inflate(inflater, container, false)
        val view = binding.root

        activity = requireActivity()
        personList = mutableListOf()


        val multipleEventRecycler = view.findViewById<RecyclerView>(R.id.mutipleEventRecycler)

        val adapter = arguments?.getString("adapter").toString()

        Log.e("MultipleEventData", "eventId::  $eventId")
        if (adapter == "adapterValue") {
            eventId = arguments?.getString("eventId").toString()
            getEdit(eventId)
            binding.createEventText.text = "Update Event"
            binding.deleteEventBtn.visibility = View.VISIBLE
        } else {
            binding.createEventText.text = "Create Event"
        }

        //All Botton here...................................................
        binding.removeImageBtn.setOnClickListener {
            removeImage()
        }

        binding.backarrowcreateevent.setOnClickListener {
            //backButtonPopup()
            val paymentsFragment = EventListFragment()
            val fr = requireFragmentManager().beginTransaction()
            fr.replace(R.id.containers, paymentsFragment)
            fr.commit()
            //dialog.dismiss()
        }

        binding.addGuestBtn.setOnClickListener {
            strCheckBtn = "3"
            if (eventId.isEmpty()) {
                singleOrMultArrayString = convertListToString(personList)
                validateHostGuestInputs(singleOrMultArrayString!!)
                Log.e("MultipleEventData", "MultiplesaveMainTxtAddGuest  $singleOrMultArrayString")
            } else {
                val intent = Intent(activity, GuestActivity::class.java)
                intent.putExtra("eventId", eventId)
                activity.startActivity(intent)
            }
        }

        binding.coHostAddBtn.setOnClickListener {
            strCheckBtn = "2"
            if (eventId.isEmpty()) {
                singleOrMultArrayString = convertListToString(personList)
                validateHostGuestInputs(singleOrMultArrayString!!)
            } else {
                val intent = Intent(activity, CoHostActivity::class.java)
                intent.putExtra("eventId", eventId)
                activity.startActivity(intent)
            }
        }

        binding.saveMainTxtBtn.setOnClickListener {
            strCheckBtn = "1"
            if (eventId.isEmpty()) {
                Log.e("ASDFGH", "MultiplesaveMainTxtBtnNew  $singleOrMultArrayString")
                validateInputs()
            } else {
                if (binding.checkbox.isChecked) {
                    event_key = 2
                    item = binding.spinner.selectedItem.toString()
                    createMultipleEventApi(event_key, singleOrMultArrayString)
                    Log.e("MultipleEventData", "createMultipleEventSave  $singleOrMultArrayString")
                } else {
                    Log.e("NewAddCreateEvent", "createSingleEventFinalApi")
                    item = binding.spinner.selectedItem.toString()
                    val venueName = binding.venueNameEdit.text.toString()
                    val venueLocation = binding.venueLocationEdit.text.toString()
                    val venueDate = binding.venueDateCreateEvent.text.toString()
                    val venueStartTime = binding.venueStartTime.text.toString()
                    val venueEndTime = binding.venueEndTime.text.toString()

                    val title = binding.eventTitleEdit.text.toString()
                    val description = binding.eventDiscriptionEdit.text.toString()

                    if (title.isEmpty()) {
                        makeText(
                            requireActivity(),
                            getString(R.string.please_enter_event_title),
                            Toast.LENGTH_SHORT
                        ).show()
                    } else if (description.isEmpty()) {
                        makeText(
                            requireActivity(),
                            getString(R.string.please_enter_event_description),
                            Toast.LENGTH_SHORT
                        ).show()
                    } else if (venueName.isEmpty()) {
                        makeText(
                            requireActivity(),
                            getString(R.string.please_enter_venue_name),
                            Toast.LENGTH_SHORT
                        ).show()
                    } else if (venueLocation.isEmpty()) {
                        makeText(
                            requireActivity(),
                            getString(R.string.please_enter_venue_location),
                            Toast.LENGTH_SHORT
                        ).show()
                    } else if (venueDate.isEmpty()) {
                        makeText(
                            requireActivity(),
                            getString(R.string.please_enter_venue_date),
                            Toast.LENGTH_SHORT
                        ).show()
                    } else if (venueStartTime.isEmpty()) {
                        makeText(
                            requireActivity(),
                            getString(R.string.please_enter_venue_start_time),
                            Toast.LENGTH_SHORT
                        ).show()
                    } else if (venueEndTime.isEmpty()) {
                        makeText(
                            requireActivity(),
                            getString(R.string.please_enter_venue_end_time),
                            Toast.LENGTH_SHORT
                        ).show()
                    } else {
                        event_key = 1
                        createSingleEventFinalApi(
                            title,
                            description,
                            venueName,
                            venueLocation,
                            venueDate,
                            venueStartTime,
                            venueEndTime,
                            event_key
                        )
                    }

                    Log.e(
                        "EventIDShow",
                        "eventId.....   $title $description $venueName $venueLocation $venueDate $venueStartTime$venueEndTime $event_key"
                    )
                }
            }
        }

        //click multiple event popup button
        binding.addevent.setOnClickListener {
            strCheckBtn = "4"
            if (eventId.isEmpty()) {
                strEventTitle = binding.eventTitleEdit.text.toString()
                strEventDescription = binding.eventDiscriptionEdit.text.toString()
                singleOrMultArrayString = convertListToString(personList)

                val selectedOption: String = binding.spinner.selectedItem.toString()
                if (binding.eventTitleEdit.text.isNullOrBlank()) {
                    makeText(
                        requireActivity(),
                        getString(R.string.please_enter_event_title),
                        Toast.LENGTH_SHORT
                    ).show()
                } else if (selectedImages.isEmpty() || selectedImages == null) {
                    makeText(
                        requireActivity(),
                        getString(R.string.please_upload_image),
                        Toast.LENGTH_SHORT
                    ).show()
                } else if (binding.eventDiscriptionEdit.text.isNullOrBlank()) {
                    makeText(
                        requireActivity(),
                        getString(R.string.please_enter_event_description),
                        Toast.LENGTH_SHORT
                    ).show()
                } else if (selectedOption == resources.getString(R.string.select_event)) {
                    makeText(
                        requireActivity(),
                        getString(R.string.please_select_event_type),
                        Toast.LENGTH_SHORT
                    ).show()
                } else {
                    createEventApi()
                    multipleEventAddPopup()
                }

                /*if (selectedImages.isEmpty()) {
                    makeText(requireActivity(), "Please upload image", Toast.LENGTH_SHORT).show()
                } else {
                    createEventApi()
                    multipleEventAddPopup()
                }*/
            } else {
                multipleEventAddPopup()
            }
        }



        userId = Festa.encryptedPrefs.UserId
        Log.e("userId", "onCreateView: $userId")
        //sendInvite Button ClickListener......................................................................
        binding.sendInvite.setOnClickListener {
            if (eventId.isEmpty()) {
            } else {
                sendInviteApi()
            }
        }

        binding.locationBtn.setOnClickListener {
            indexOfLocation = -2
            val intent = Intent(requireContext(), LocationActivity::class.java)
            startActivityForResult(intent, PLACE_PICKUP_REQUEST_CODE)
        }

        binding.checkbox.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) {
                event_key = 2
                binding.singleEventLinear.visibility = View.GONE
                binding.addmultiple.visibility = View.GONE
                binding.multiple.visibility = View.VISIBLE
                multipleEventRecycler.visibility = View.VISIBLE
            } else {
                event_key = 1
                binding.singleEventLinear.visibility = View.VISIBLE
                binding.addmultiple.visibility = View.VISIBLE
                binding.multiple.visibility = View.GONE
                multipleEventRecycler.visibility = View.GONE
            }
        }

        /* binding.checkbox.setOnClickListener {
             binding.singleEventLinear.visibility = View.GONE
             binding.addmultiple.visibility = View.GONE
             binding.multiple.visibility = View.VISIBLE
             mutipleEventRecycler.visibility = View.VISIBLE

             if (!isset) {
                 binding.singleEventLinear.visibility = View.GONE
                 binding.multiple.visibility = View.VISIBLE
                 binding.addmultiple.visibility = View.GONE
                 mutipleEventRecycler.visibility = View.VISIBLE
                 event_key = 2
                 isset = true
             } else {
                 binding.singleEventLinear.visibility = View.VISIBLE
                 binding.multiple.visibility = View.GONE
                 binding.addmultiple.visibility = View.VISIBLE
                 mutipleEventRecycler.visibility = View.GONE
                 isset = false
                 event_key = 1
             }
         }*/

        //Select multiple image Button
        binding.addImgCreateEvent.setOnClickListener {
            openGalleryForImages()
        }

        binding.spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                adapterView: AdapterView<*>?, view: View?, i: Int, l: Long
            ) {
                //Toast.makeText(requireActivity(), "Country Spinner Working **********", Toast.LENGTH_SHORT).show()
                item = binding.spinner.selectedItem.toString()
                Log.e("SpinnerItem", "item$item")
                if (item == getString(R.string.select_event)) {
                } else {
                    if (item.equals("Business Conference", ignoreCase = true)) {
                        eventType = "Business Conference"
                    } else if (item.equals("Music Festivals", ignoreCase = true)) {
                        eventType = "Music Festivals"
                    } else if (item.equals("Birthday", ignoreCase = true)) {
                        eventType = "Birthday"
                    } else if (item.equals("Exhibitions", ignoreCase = true)) {
                        eventType = "Exhibitions"
                    } else if (item.equals("Wedding Anniversary", ignoreCase = true)) {
                        eventType = "Wedding Anniversary"
                    } else if (item.equals("Sports", ignoreCase = true)) {
                        eventType = "Sports"
                    } else if (item.equals("Marriage", ignoreCase = true)) {
                        eventType = "Marriage"
                    }
                }
            }

            override fun onNothingSelected(adapterView: AdapterView<*>?) {
            }
        }

        //Add EventType List
        eventlist.add("Business Conference")
        eventlist.add("Music Festivals")
        eventlist.add("Birthday")
        eventlist.add("Exhibitions")
        eventlist.add("Wedding Anniversary")
        eventlist.add("Sports")
        eventlist.add("Marriage")

        //Spinner Adapter
        val dAdapter = spinnerAdapter(requireContext(), R.layout.custom_spinner_two, strEventlist)
        dAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        dAdapter.add("Select event type")
        dAdapter.addAll(eventlist)
        binding.spinner.adapter = dAdapter

        binding.venueDateCreateEvent.setOnClickListener {
            val c = Calendar.getInstance()
            val year = c.get(Calendar.YEAR)
            val month = c.get(Calendar.MONTH)
            val day = c.get(Calendar.DAY_OF_MONTH)

            val dpd = DatePickerDialog(
                requireContext(), { _, selectedYear, monthOfYear, dayOfMonth ->
                    //Display Selected date in textbox
                    val MONTHSS = arrayOf(
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec"
                    )

                    val selectedDate = Calendar.getInstance()
                    selectedDate.set(selectedYear, monthOfYear, dayOfMonth)

                    //Check if the selected date is before the current date
                    if (selectedDate.before(c)) {
                        //Show a message or handle the case where the selected date is before the current date
                        makeText(
                            requireContext(),
                            "Please select a date not before the current date.",
                            Toast.LENGTH_SHORT
                        ).show()
                    } else {
                        // Update UI and variables if the selected date is valid
                        val strDatePopup = "$dayOfMonth ${MONTHSS[monthOfYear]}, $selectedYear"
                        binding.venueDateCreateEvent.text = strDatePopup

                        val formattedMonth = String.format("%02d", month + 1)
                        val formatDay = String.format("%02d", day)
                        strPopUpdate = "$year-$formattedMonth-$formatDay"
                    }
                }, year, month, day
            )

            //Set the minimum date for the DatePickerDialog to the current date
            dpd.datePicker.minDate = c.timeInMillis
            dpd.show()
        }

        binding.venueStartTime.setOnClickListener {
            var mcurrentTime: Calendar? = null
            var hour = 0
            var minute = 0

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                mcurrentTime = Calendar.getInstance()
                hour = mcurrentTime!!.get(Calendar.HOUR_OF_DAY)
                minute = mcurrentTime.get(Calendar.MINUTE)
            }

            val mTimePicker: TimePickerDialog
            mTimePicker = TimePickerDialog(
                requireActivity(), { _, selectedHour, selectedMinute ->
                    val formattedhour = String.format("%02d", selectedHour)
                    val formatMinutes = String.format("%02d", selectedMinute)
                    val amPm = if (selectedHour < 12) "AM" else "PM"
                    strStartTime = ("$formattedhour:$formatMinutes $amPm")
                    binding.venueStartTime.text = strStartTime
                }, hour, minute, true // Yes, 24-hour time
            )
            mTimePicker.show()
        }

        binding.venueEndTime.setOnClickListener {
            var mcurrentTime: Calendar? = null
            var hour = 0
            var minute = 0
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                mcurrentTime = Calendar.getInstance()
                hour = mcurrentTime!!.get(Calendar.HOUR_OF_DAY)
                minute = mcurrentTime!!.get(Calendar.MINUTE)
            }

            val mTimePicker: TimePickerDialog
            mTimePicker = TimePickerDialog(
                requireActivity(), { _, selectedHour, selectedMinute ->
                    val formattedhour = String.format("%02d", selectedHour)
                    val formatMinutes = String.format("%02d", selectedMinute)
                    val amPm = if (selectedHour < 12) "AM" else "PM"
                    strEndTime = ("$formattedhour:$formatMinutes $amPm")
                    binding.venueEndTime.text = strEndTime
                }, hour, minute, true // Yes, 24-hour time
            )
            //mTimePicker.setTitle("Select Time")
            mTimePicker.show()
        }

        //Create Event Observer
        createEventObserver()
        createSingleEventObserver()
        getEditObserver()
        sendInviteObserver()
        createMultiEventObserver()
        deleteSubEventObserver()

        return view
    }

    @SuppressLint("MissingInflatedId", "NotifyDataSetChanged")
    @RequiresApi(Build.VERSION_CODES.N)
    private fun multipleEventAddPopup() {
        val dialogView = layoutInflater.inflate(R.layout.addvenuedateandtime, null)
        val builder = AlertDialog.Builder(requireActivity()).setView(dialogView)
        val dialog = builder.create()
        venueTitlePopUp = dialogView.findViewById(R.id.venueTitlePopUp)
        venueNamePopUp = dialogView.findViewById(R.id.venueNamePopUp)
        venueLocationPopUp = dialogView.findViewById(R.id.venueLocationPopUp)
        venueDatePopUp = dialogView.findViewById(R.id.venueDatePopUp)
        venueStartTimePopUp = dialogView.findViewById(R.id.venueStartTimePopUp)
        venueEndTimePopUp = dialogView.findViewById(R.id.venueEndTimePopUp)
        val venueSavePopUp = dialogView.findViewById<TextView>(R.id.venueSaveTextPopUp)
        val mapLocationBtn = dialogView.findViewById<ImageView>(R.id.mapLocationBtn)
        dialog.window!!.setBackgroundDrawable(ColorDrawable(android.graphics.Color.TRANSPARENT))
        dialog.show()

        //venueTitlePopUp.setText(StEventTitlepopup)
        mapLocationBtn.setOnClickListener {
            indexOfLocation = -3
            val intent = Intent(requireContext(), LocationActivity::class.java)
            startActivityForResult(intent, PLACE_PICKUP_REQUEST_CODE)
        }

        venueDatePopUp.setOnClickListener {
            val c = Calendar.getInstance()
            val year = c.get(Calendar.YEAR)
            val month = c.get(Calendar.MONTH)
            val day = c.get(Calendar.DAY_OF_MONTH)

            val dpd = DatePickerDialog(
                requireContext(), { _, selectedYear, monthOfYear, dayOfMonth ->
                    // Display Selected date in textbox
                    val MONTHSS = arrayOf(
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec"
                    )

                    val selectedDate = Calendar.getInstance()
                    selectedDate.set(selectedYear, monthOfYear, dayOfMonth)

                    //Check if the selected date is before the current date
                    if (selectedDate.before(c)) {
                        //Show a message or handle the case where the selected date is before the current date
                        makeText(
                            requireContext(),
                            "Please select a date not before the current date.",
                            Toast.LENGTH_SHORT
                        ).show()
                    } else {
                        //Update UI and variables if the selected date is valid
                        val strDatePopup = "$dayOfMonth ${MONTHSS[monthOfYear]}, $selectedYear"
                        venueDatePopUp.text = strDatePopup

                        val formattedMonth = String.format("%02d", month + 1)
                        val formatDay = String.format("%02d", day)
                        strPopUpdate = "$year-$formattedMonth-$formatDay"
                    }
                }, year, month, day
            )

            //Set the minimum date for the DatePickerDialog to the current date
            dpd.datePicker.minDate = c.timeInMillis
            dpd.show()
        }

        venueStartTimePopUp.setOnClickListener {
            var mcurrentTime: Calendar? = null
            var hour = 0
            var minute = 0
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                mcurrentTime = Calendar.getInstance()
                hour = mcurrentTime!!.get(Calendar.HOUR_OF_DAY)
                minute = mcurrentTime.get(Calendar.MINUTE)
            }

            val mTimePicker = TimePickerDialog(
                requireActivity(), { _, selectedHour, selectedMinute ->
                    val formattedhour = String.format("%02d", selectedHour)
                    val formatMinutes = String.format("%02d", selectedMinute)
                    val amPm = if (selectedHour < 12) "AM" else "PM"
                    strStartTimePOpUp = ("$formattedhour:$formatMinutes $amPm")
                    venueStartTimePopUp.text = strStartTimePOpUp
                }, hour, minute, true // Yes, 24-hour time
            )
            // mTimePicker.setTitle("Select Time")
            mTimePicker.show()
        }

        venueEndTimePopUp.setOnClickListener {
            var mcurrentTime: Calendar? = null
            var hour = 0
            var minute = 0
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                mcurrentTime = Calendar.getInstance()
                hour = mcurrentTime!!.get(Calendar.HOUR_OF_DAY)
                minute = mcurrentTime!!.get(Calendar.MINUTE)
            }

            val mTimePicker = TimePickerDialog(
                requireActivity(), { _, selectedHour, selectedMinute ->
                    val formattedhour = String.format("%02d", selectedHour)
                    val formatMinutes = String.format("%02d", selectedMinute)
                    val amPm = if (selectedHour < 12) "AM" else "PM"
                    strEnddTimePOpUp = ("$formattedhour:$formatMinutes $amPm")
                    strEndTimePoppp = ("$formattedhour:$formatMinutes")
                    venueEndTimePopUp.text = strEnddTimePOpUp
                }, hour, minute, true // Yes, 24-hour time
            )

            //mTimePicker.setTitle("Select Time")
            mTimePicker.show()
        }

        venueSavePopUp.setOnClickListener {
            val venueTitle = venueTitlePopUp.text.toString()
            val venueName = venueNamePopUp.text.toString()
            val venueLocation = venueLocationPopUp.text.toString()
            val venueDate = venueDatePopUp.text.toString()
            val venueStartTime = venueStartTimePopUp.text.toString()
            val venueEndTime = venueEndTimePopUp.text.toString()
            if (venueName.isEmpty()) {
                makeText(
                    requireActivity(),
                    getString(R.string.please_enter_venue_name),
                    Toast.LENGTH_SHORT
                ).show()
            } else if (venueLocation.isEmpty()) {
                makeText(
                    requireActivity(),
                    getString(R.string.please_enter_location),
                    Toast.LENGTH_SHORT
                ).show()
            } else if (venueDate.isEmpty()) {
                makeText(
                    requireActivity(),
                    getString(R.string.please_enter_date),
                    Toast.LENGTH_SHORT
                ).show()
            } else if (venueStartTime.isEmpty()) {
                makeText(
                    requireActivity(),
                    getString(R.string.please_enter_start_time),
                    Toast.LENGTH_SHORT
                ).show()
            } else if (venueEndTime.isEmpty()) {
                makeText(
                    requireActivity(),
                    getString(R.string.please_enter_end_date),
                    Toast.LENGTH_SHORT
                ).show()
            } else {
                //Save the new contact
                val addFillData = CreateMultipleEventModel(
                    venueTitle,
                    venueName,
                    venueLocation,
                    venueDate,
                    venueStartTime,
                    venueEndTime
                )
                personList.add(addFillData)
                val gson = Gson()
                singleOrMultArrayString = gson.toJson(personList.filterNotNull().map { model ->
                    mapOf(
                        "sub_event_title" to model.venueTitle,
                        "venue_Name" to model.venueName,
                        "venue_location" to model.venueLocation,
                        "date" to model.venueDate,
                        "start_time" to model.venueStartTime,
                        "end_time" to model.venueEndTime
                    )
                })

                event_key = 2
                createMultipleEventApi(event_key, singleOrMultArrayString)
                Log.e("MultipleEventData", " singleOrMultArrayString  $singleOrMultArrayString")

                //Notify the adapter of the new data
                multipleAdapter?.notifyDataSetChanged()
                dialog.dismiss()
            }
        }
    }

    //Get Details Api
    private fun getEdit(eventId: String?) {
        getEditModel.getEditdata(progressDialog, activity, eventId!!)
    }

    @SuppressLint("FragmentLiveDataObserve")
    private fun getEditObserver() {
        getEditModel.progressIndicator.observe(viewLifecycleOwner) {}

        getEditModel.mgeteditresponse.observe(viewLifecycleOwner) {
            val message = it.peekContent().message
            val users = it.peekContent().eventData
            val images = it.peekContent().eventData?.images
            val venueDateTime = it.peekContent().eventData?.venueDateAndTime
            val eventStatus = it.peekContent().eventData?.eventStatus
            val eventKey = it.peekContent().eventData?.eventKey
            guestList = it.peekContent().eventData?.venueDateAndTime!!
            eventId = it.peekContent().eventData!!.id.toString()

            Log.e("EventKeyValue", " event_key " + event_key + "eventStatus  " + eventStatus)
            if (eventKey != null) {
                //Do something with the non-null eventKey
                event_key = eventKey
                if (event_key == 1) {
                    for (i in venueDateTime!!) {
                        val venueName = i.venueName.toString()
                        val venueLocation = i.venueLocation.toString()
                        val venueDate = i.date.toString()
                        val venueStart = i.startTime.toString()
                        val venueEndTime = i.endTime.toString()
                        binding.venueNameEdit.text =
                            Editable.Factory.getInstance().newEditable(venueName)
                        binding.venueLocationEdit.text =
                            Editable.Factory.getInstance().newEditable(venueLocation)
                        binding.venueStartTime.text =
                            Editable.Factory.getInstance().newEditable(venueStart)
                        binding.venueEndTime.text =
                            Editable.Factory.getInstance().newEditable(venueEndTime)
                        binding.venueDateCreateEvent.text =
                            Editable.Factory.getInstance().newEditable(venueDate)
                        binding.singleEventLinear.visibility = View.VISIBLE
                        binding.mutipleEventRecycler.visibility = View.GONE
                    }
                } else {
                    binding.checkbox.isChecked = true
                    binding.singleEventLinear.visibility = View.GONE
                    binding.mutipleEventRecycler.visibility = View.VISIBLE
                    binding.mutipleEventRecycler.isVerticalScrollBarEnabled = true
                    binding.mutipleEventRecycler.isVerticalFadingEdgeEnabled = true
                    binding.mutipleEventRecycler.layoutManager =
                        LinearLayoutManager(requireContext(), LinearLayoutManager.VERTICAL, false)
                    multipleAdapter = MultipleEventAdapter(
                        requireContext(), guestList, this
                        ,eventId)
                    binding.mutipleEventRecycler.adapter = multipleAdapter
                }
            } else {
                //Handle the case where eventKey is null
            }

            eventType = it.peekContent().eventData?.eventType.toString()
            if (users != null) {
                if (users.title != null) {
                    binding.eventTitleEdit.text =
                        Editable.Factory.getInstance().newEditable(users.title)
                }

                if (users.description != null) {
                    binding.eventDiscriptionEdit.text =
                        Editable.Factory.getInstance().newEditable(users.description)
                }

                interestedInMethod(eventType)

                val zerothImage: String? = if (images?.isNotEmpty() == true) {
                    images[0]
                } else {
                    null // or provide a default value or handle the case appropriately
                }

                Glide.with(this).load("http://13.51.205.211:6002/$zerothImage")
                    .placeholder(R.drawable.user).into(binding.multipleImageSelect)
            }
        }

        getEditModel.errorResponse.observe(viewLifecycleOwner) {
            ErrorUtil.handlerGeneralError(requireActivity(), it)
        }
    }


    //Validation All field method
    private fun validateHostGuestInputs(singleOrMultArrayString: String) {
        strEventTitle = binding.eventTitleEdit.text.toString()
        strEventDescription = binding.eventDiscriptionEdit.text.toString()

        val selectedOption: String = binding.spinner.selectedItem.toString()
        if (binding.eventTitleEdit.text.isNullOrBlank()) {
            makeText(
                requireActivity(), getString(R.string.please_enter_event_title), Toast.LENGTH_SHORT
            ).show()
        } else if (binding.eventDiscriptionEdit.text.isNullOrBlank()) {
            makeText(
                requireActivity(),
                getString(R.string.please_enter_event_description),
                Toast.LENGTH_SHORT
            ).show()
        } else if (selectedOption == resources.getString(R.string.select_event)) {
            makeText(
                requireActivity(),
                getString(R.string.please_select_event_type),
                Toast.LENGTH_SHORT
            ).show()
        } else {
            createEventHostGuestApi(singleOrMultArrayString)
        }
    }

    // Create Event Api
    private fun createEventHostGuestApi(singleOrMultArrayStrings: String) {
        // val userIds = RequestBody.create(MultipartBody.FORM, userId.toString())
        val title = strEventTitle.toRequestBody(MultipartBody.FORM)
        val description = strEventDescription.toRequestBody(MultipartBody.FORM)
        val eventType = item.toRequestBody(MultipartBody.FORM)
        val cityName = strCityName.toRequestBody(MultipartBody.FORM)
        val venue_Date_and_time = singleOrMultArrayStrings.toRequestBody(MultipartBody.FORM)
        val fileList = mutableListOf<File>()

        Log.e("cityName", "  cityName::   $cityName  $strCityName")

        for (path in outputList) {
            fileList.add(File(path))
        }

        //val stringBuilder = StringBuilder()
        val fileMultipartBody = arrayOfNulls<MultipartBody.Part>(selectedImages.size)
        for (index in selectedImages.indices) {
            val file = File(selectedImages[index].path)
            val reportBody = file.asRequestBody("image/*".toMediaTypeOrNull())
            fileMultipartBody[index] =
                MultipartBody.Part.createFormData("images", file.name, reportBody)
        }

        createEventViewModel.getCreateEvent(
            progressDialog,
            activity,
            userId,
            title,
            description,
            eventType,
            venue_Date_and_time,
            fileMultipartBody,
            cityName
        )
    }

    private fun createEventObserver() {
        createEventViewModel.progressIndicator.observe(requireActivity()) {}

        createEventViewModel.createEventResponse.observe(requireActivity()) {
            val message = it.peekContent().message
            eventId = it.peekContent().eventId.toString()

            Log.e("EventIdAFD", "message" + message + "eventId " + eventId)
            makeText(requireActivity(), message, Toast.LENGTH_SHORT).show()

            when (strCheckBtn) {
                "2" -> {
                    val intent = Intent(activity, CoHostActivity::class.java)
                    intent.putExtra("eventId", eventId)
                    activity.startActivity(intent)
                }
                "3" -> {
                    val intent = Intent(activity, GuestActivity::class.java)
                    intent.putExtra("eventId", eventId)
                    activity.startActivity(intent)
                }

                /*"1" -> {
                    val intent = Intent(requireActivity(), DashboardActivity::class.java)
                    intent.putExtra("login", "login")
                    startActivity(intent)
                    activity.finish()
                }*/
            }
        }

        createEventViewModel.errorResponse.observe(requireActivity()) {
            ErrorUtil.handlerGeneralError(requireActivity(), it)
        }
    }

    //Validation All field method With Save Button
    private fun validateInputs() {
        strEventTitle = binding.eventTitleEdit.text.toString()
        strEventDescription = binding.eventDiscriptionEdit.text.toString()
        item = binding.spinner.selectedItem.toString()
        val venueTitle = ""
        val venueName = binding.venueNameEdit.text.toString()
        val venueLocation = binding.venueLocationEdit.text.toString()
        val venueDate = binding.venueDateCreateEvent.text.toString()
        val venueStartTime = binding.venueStartTime.text.toString()
        val venueEndTime = binding.venueEndTime.text.toString()

        val selectedOption: String = binding.spinner.selectedItem.toString()
        if (binding.eventTitleEdit.text.isNullOrBlank()) {
            makeText(
                requireActivity(), getString(R.string.please_enter_event_title), Toast.LENGTH_SHORT
            ).show()
        } else if (selectedImages.isEmpty() || selectedImages == null) {
            makeText(
                requireActivity(),
                getString(R.string.please_upload_image),
                Toast.LENGTH_SHORT
            ).show()
        } else if (binding.eventDiscriptionEdit.text.isNullOrBlank()) {
            makeText(
                requireActivity(),
                getString(R.string.please_enter_event_description),
                Toast.LENGTH_SHORT
            ).show()
        } else if (selectedOption == resources.getString(R.string.select_event)) {
            makeText(
                requireActivity(),
                getString(R.string.please_select_event_type),
                Toast.LENGTH_SHORT
            ).show()
        } else {
            if (binding.checkbox.isChecked) {
                singleOrMultArrayString = convertListToString(personList)
                createEventHostGuestApi(singleOrMultArrayString!!)
            } else {
                if (venueName.isBlank()) {
                    makeText(
                        requireActivity(),
                        getString(R.string.please_enter_venue_name),
                        Toast.LENGTH_SHORT
                    ).show()
                } else if (venueLocation.isBlank()) {
                    makeText(
                        requireActivity(),
                        getString(R.string.please_enter_venue_location),
                        Toast.LENGTH_SHORT
                    ).show()
                } else if (venueDate.isBlank()) {
                    makeText(
                        requireActivity(),
                        getString(R.string.please_enter_venue_date),
                        Toast.LENGTH_SHORT
                    ).show()
                } else if (venueStartTime.isBlank()) {
                    makeText(
                        requireActivity(),
                        getString(R.string.please_enter_venue_start_time),
                        Toast.LENGTH_SHORT
                    ).show()
                } else if (venueEndTime.isBlank()) {
                    makeText(
                        requireActivity(),
                        getString(R.string.please_enter_venue_end_time),
                        Toast.LENGTH_SHORT
                    ).show()
                } else {
                    val addFillData = CreateMultipleEventModel(
                        venueTitle,
                        venueName,
                        venueLocation,
                        venueDate,
                        venueStartTime,
                        venueEndTime
                    )
                    personList.add(addFillData)
                    val gson = Gson()
                    singleOrMultArrayString = gson.toJson(personList.filterNotNull().map { model ->
                        mapOf(
                            "sub_event_title" to model.venueTitle,
                            "venue_Name" to model.venueName,
                            "venue_location" to model.venueLocation,
                            "date" to model.venueDate,
                            "start_time" to model.venueStartTime,
                            "end_time" to model.venueEndTime
                        )
                    })
                    Log.e(
                        "MultipleEventData",
                        "singleOrMultArrayString Buttton  $singleOrMultArrayString   selectedImages   $selectedImages"
                    )
                    createEventApi()
                }
            }
        }
    }

    //Create Event Api With Save Button
    private fun createEventApi() {
        //val userIds = RequestBody.create(MultipartBody.FORM, userId.toString())
        val title = strEventTitle.toRequestBody(MultipartBody.FORM)
        val description = strEventDescription.toRequestBody(MultipartBody.FORM)
        val eventType = item.toRequestBody(MultipartBody.FORM)
        val cityName = strCityName.toRequestBody(MultipartBody.FORM)
        val venue_Date_and_time =
            singleOrMultArrayString.toString().toRequestBody(MultipartBody.FORM)
        val fileList = mutableListOf<File>()
        if (outputList.isEmpty()) {
            makeText(context, getString(R.string.please_select_image), Toast.LENGTH_SHORT).show()
            return
        }

        Log.e("cityName", "  cityName::   $cityName  $strCityName")

        Log.e(
            "MultipleEventData",
            " title   $strEventTitle description  $strEventDescription  item  $item singleOrMultArrayString  $singleOrMultArrayString"
        )

        for (path in outputList) {
            fileList.add(File(path))
        }

        //val stringBuilder = StringBuilder()
        val fileMultipartBody = arrayOfNulls<MultipartBody.Part>(selectedImages.size)
        for (index in selectedImages.indices) {
            val file = File(selectedImages[index].path)
            val reportBody = file.asRequestBody("image/*".toMediaTypeOrNull())
            fileMultipartBody[index] =
                MultipartBody.Part.createFormData("images", file.name, reportBody)
        }

        createEventViewModel.getCreateEvent(
            progressDialog,
            activity,
            userId,
            title,
            description,
            eventType,
            venue_Date_and_time,
            fileMultipartBody,
            cityName
        )
    }

    //Update SingleEvent Api
    private fun createSingleEventFinalApi(
        title: String,
        description: String,
        venueName: String,
        venueLocation: String,
        venueDate: String,
        venueStartTime: String,
        venueEndTime: String,
        event_key: Int
    ) {
        //val userIds = RequestBody.create(MultipartBody.FORM, userId.toString())
        val titles = title.toRequestBody(MultipartBody.FORM)
        val descriptions = description.toRequestBody(MultipartBody.FORM)
        val eventTypes = item.toRequestBody(MultipartBody.FORM)
        val venueNames = venueName.toRequestBody(MultipartBody.FORM)
        val venueLocations = venueLocation.toRequestBody(MultipartBody.FORM)
        val venueDates = venueDate.toRequestBody(MultipartBody.FORM)
        val venueStartTimes = venueStartTime.toRequestBody(MultipartBody.FORM)
        val venueEndTimes = venueEndTime.toRequestBody(MultipartBody.FORM)
        val event_key = event_key.toString().toRequestBody(MultipartBody.FORM)
        val cityName = strCityName.toRequestBody(MultipartBody.FORM)
        val fileList = mutableListOf<File>()

        Log.e("cityName", "  cityName::   $cityName  $strCityName")

        for (path in outputList) {
            fileList.add(File(path))
        }

        Log.e("ASDFGH", "ASDFGHEventKeySignle  $event_key")

        //val stringBuilder = StringBuilder()
        val fileMultipartBody = arrayOfNulls<MultipartBody.Part>(selectedImages.size)
        for (index in selectedImages.indices) {
            //stringBuilder.append(selectedImages[index].path).append("\n")
            val file = File(selectedImages[index].path)
            val reportBody = file.asRequestBody("image/*".toMediaTypeOrNull())
            fileMultipartBody[index] =
                MultipartBody.Part.createFormData("images", file.name, reportBody)
        }

        Log.e(
            "EventIDShow",
            "eventId.....One $title $description $venueName $venueLocation $venueDate $venueStartTime$venueEndTime $event_key"
        )

        createFinalEventViewModel.getCreateEvent(
            progressDialog,
            activity,
            eventId,
            titles,
            descriptions,
            eventTypes,
            venueNames,
            venueLocations,
            venueDates,
            venueStartTimes,
            venueEndTimes,
            event_key,
            fileMultipartBody,
            cityName
        )
    }

    private fun createSingleEventObserver() {
        createFinalEventViewModel.progressIndicator.observe(requireActivity()) {}

        createFinalEventViewModel.mcreateEventResponse.observe(requireActivity()) {
            val message = it.peekContent().successMessage

            makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
            getEdit(eventId)
            /*  if (strCheckBtn == "2") {
                 val eventIds = Festa.encryptedPrefs.eventIds
                 val intent = Intent(activity, CoHostActivity::class.java)
                 intent.putExtra("eventId", eventIds)
                 activity.startActivity(intent)
             } else if (strCheckBtn == "3") {
                 val eventIds = Festa.encryptedPrefs.eventIds
                 val intent = Intent(activity, GuestActivity::class.java)
                 intent.putExtra("eventId", eventIds)
                 activity.startActivity(intent)
             }*/
        }
        createFinalEventViewModel.errorResponse.observe(requireActivity()) {
            ErrorUtil.handlerGeneralError(requireActivity(), it)
            //errorDialogs()
        }
    }


    //Update MultipleEvent Api
    private fun createMultipleEventApi(event_key: Int, singleOrMultArrayString: String?) {
        //val userIds = RequestBody.create(MultipartBody.FORM, userId.toString())
        val title = strEventTitle.toRequestBody(MultipartBody.FORM)
        val description = strEventDescription.toRequestBody(MultipartBody.FORM)
        val eventType = item.toRequestBody(MultipartBody.FORM)
        val venue_Date_and_time =
            singleOrMultArrayString.toString().toRequestBody(MultipartBody.FORM)
        val eventKey = event_key.toString().toRequestBody(MultipartBody.FORM)
        val cityName = strCityName.toRequestBody(MultipartBody.FORM)
        val fileList = mutableListOf<File>()

        Log.e("cityName", "  multiple cityName::   $cityName  $strCityName")

        Log.e("SpinnerItem", " singleOrMultiArrayString  $item")
        for (path in outputList) {
            fileList.add(File(path))
        }

        //val stringBuilder = StringBuilder()
        val fileMultipartBody = arrayOfNulls<MultipartBody.Part>(selectedImages.size)
        for (index in selectedImages.indices) {
            //stringBuilder.append(selectedImages[index].path).append("\n")

            val file = File(selectedImages[index].path)
            val reportBody = file.asRequestBody("image/*".toMediaTypeOrNull())
            fileMultipartBody[index] =
                MultipartBody.Part.createFormData("images", file.name, reportBody)
        }

        createMultiEventViewModel.getCreateEvent(
            progressDialog,
            activity,
            eventId,
            title,
            description,
            eventType,
            venue_Date_and_time,
            eventKey,
            fileMultipartBody,
            cityName
        )
    }

    private fun createMultiEventObserver() {
        createMultiEventViewModel.progressIndicator.observe(requireActivity()) {}

        createMultiEventViewModel.mcreateEventResponse.observe(requireActivity()) {
            val message = it.peekContent().successMessage
            val success = it.peekContent().success
            makeText(requireContext(), message, Toast.LENGTH_SHORT).show()

            if (success == true) {
                personList.clear()
                singleOrMultArrayString = ""
            }

            getEdit(eventId)
            /* if (strCheckBtn == "2") {
                 val intent = Intent(activity, CoHostActivity::class.java)
                 intent.putExtra("eventId", eventId)
                 activity.startActivity(intent)
             } else if (strCheckBtn == "3") {
                 val intent = Intent(activity, GuestActivity::class.java)
                 intent.putExtra("eventId", eventId)
                 activity.startActivity(intent)
             }*/
        }

        createMultiEventViewModel.errorResponse.observe(requireActivity()) {
            ErrorUtil.handlerGeneralError(requireActivity(), it)
        }
    }

    private fun sendInviteApi() {
        sendInviteModel.sendInvites(
            progressDialog, activity, eventId
        )

        Log.e("EventIDShow", "InviteEventId$eventId")
    }

    @SuppressLint("FragmentLiveDataObserve")
    private fun sendInviteObserver() {
        sendInviteModel.progressIndicator.observe(viewLifecycleOwner) {}

        sendInviteModel.mbookmark.observe(viewLifecycleOwner) {
            val message = it.peekContent().successMessage
            makeText(requireActivity(), message, Toast.LENGTH_SHORT).show()
        }

        sendInviteModel.errorResponse.observe(viewLifecycleOwner) {
            ErrorUtil.handlerGeneralError(requireActivity(), it)
        }
    }

    //Delete Guest Api/............................................................
    override fun onDeleteClick(position: Int, id: String) {
        deleteGuest(id)
    }

    private fun deleteGuest(guestId: String) {
        deleteEventViewModel.deleteGuest(progressDialog, activity, guestId, eventId)
    }

    private fun deleteSubEventObserver() {
        deleteEventViewModel.progressIndicator.observe(requireActivity()) {}

        deleteEventViewModel.mDeleteResponse.observe(requireActivity()) {
            val message = it.peekContent().message
            makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
            getEdit(eventId)
        }

        deleteEventViewModel.errorResponse.observe(requireActivity()) {
            ErrorUtil.handlerGeneralError(requireActivity(), it)
        }
    }

    private fun openGalleryForImages() {
        val intent = Intent(Intent.ACTION_GET_CONTENT)
        intent.type = "image/*"
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
        startActivityForResult(Intent.createChooser(intent, "Select Pictures"), REQUEST_IMAGE_PICK)
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_IMAGE_PICK && resultCode == Activity.RESULT_OK) {
            val clipData = data?.clipData
            if (clipData != null) {
                // Multiple images selected
                for (i in 0 until clipData.itemCount) {
                    val uri = clipData.getItemAt(i).uri
                    val file = createImageFile()
                    selectedImages.add(file)
                    copyUriToFile(uri, file)
                    binding.multipleImageSelect.setImageURI(uri)
                }
            } else if (data?.data != null) {
                // Single image selected
                val uri = data.data
                val file = createImageFile()
                selectedImages.add(file)
                if (uri != null) {
                    copyUriToFile(uri, file)
                    binding.multipleImageSelect.setImageURI(uri)
                }
            }

            //Display the selected images (names) after the user has finished selecting
            displaySelectedImages()

            //Use the selectedImages list for further processing
            for (imageFile in selectedImages) {
                Log.d("SelectedImage", imageFile.absolutePath)
            }
        }
    }

    private fun createImageFile(): File {
        // Create an image file name
        val timeStamp: String =
            SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir: File =
            requireContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES)!!

        return File.createTempFile(
            "JPEG_${timeStamp}_", /* prefix */
            ".jpg", /* suffix */
            storageDir /* directory */
        )
    }

    private fun copyUriToFile(uri: android.net.Uri, file: File) {
        requireContext().contentResolver.openInputStream(uri)?.use { input ->
            file.outputStream().use { output ->
                input.copyTo(output)
            }
        }
    }

    //Add Multiple event Popup method
    private fun displaySelectedImages() {
        outputList.clear() // Clear the list before adding new items

        for (selectedImage in selectedImages) {
            //Extract the full file name
            val fileName = selectedImage.name
            outputList.add(fileName)
        }

        Log.e("AllSelectImg", outputList.toString())
    }


    private fun removeImage() {
        // Clear the list of selected images and reset the ImageView
        selectedImages.clear()
        //binding.multipleImageSelect.setImageResource(R.drawable.baseline_add_circle_outline_24)
        binding.multipleImageSelect.setImageResource(R.drawable.select_photo_dotted)

        // Optionally, you may also want to update the UI or perform additional actions.
        // For example, if you have a list of displayed image names, you may want to clear that list.
        outputList.clear()
        Log.e("AllSelectImg", outputList.toString())
    }

    //Add backButton Popup method
    class spinnerAdapter constructor(
        context: Context, textViewResourceId: Int, strInterestedList: List<String>
    ) : ArrayAdapter<String?>(context, textViewResourceId)

    private fun interestedInMethod(eventTypes: String?) {
        val dAdapter = spinnerAdapter(requireContext(), R.layout.custom_spinner_two, strEventlist)
        dAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        dAdapter.addAll(eventlist)
        binding.spinner.adapter = dAdapter

        if (eventTypes.equals("Business_Conference")) {
            val spinnerPosition1: Int = dAdapter.getPosition("Business_Conference")
            binding.spinner.setSelection(spinnerPosition1)
        } else if (eventTypes.equals("Music_Festivals")) {
            val spinnerPosition2: Int = dAdapter.getPosition("Music_Festivals")
            binding.spinner.setSelection(spinnerPosition2)
        } else if (eventTypes.equals("Birthday")) {
            val spinnerPosition3: Int = dAdapter.getPosition("Birthday")
            binding.spinner.setSelection(spinnerPosition3)
        } else if (eventTypes.equals("Exhibitions")) {
            val spinnerPosition3: Int = dAdapter.getPosition("Exhibitions")
            binding.spinner.setSelection(spinnerPosition3)
        } else if (eventTypes.equals("Wedding_Anniversary")) {
            val spinnerPosition3: Int = dAdapter.getPosition("Wedding_Anniversary")
            binding.spinner.setSelection(spinnerPosition3)
        } else if (eventTypes.equals("Sports")) {
            val spinnerPosition3: Int = dAdapter.getPosition("Sports")
            binding.spinner.setSelection(spinnerPosition3)
        } else if (eventTypes.equals("Marriage")) {
            val spinnerPosition3: Int = dAdapter.getPosition("Marriage")
            binding.spinner.setSelection(spinnerPosition3)
        }
    }

    private fun convertListToString(personList: List<CreateMultipleEventModel>): String {
        val stringBuilder = StringBuilder("[")
        personList.forEachIndexed { index, person ->
            stringBuilder.append(person.toString())
            if (index < personList.size - 1) {
                stringBuilder.append(",")
            }
        }
        stringBuilder.append("]")
        return stringBuilder.toString()
    }


    override fun onResume() {
        super.onResume()

        if (event_key == 2) {
            getEdit(eventId)
        }

        if (indexOfLocation == -2) {
            binding.venueLocationEdit.text =
                Editable.Factory.getInstance().newEditable(LocationActivity.myPlace)
            getLocationFromAddress(requireActivity(), LocationActivity.myPlace)
        }

        if (indexOfLocation == -3) {
            venueLocationPopUp.text =
                Editable.Factory.getInstance().newEditable(LocationActivity.myPlace)
            getLocationFromAddress(requireActivity(), LocationActivity.myPlace)
        }
        Log.e("currentLatLng", "currentLocation...   " + LocationActivity.myPlace)
    }


    private fun getLocationFromAddress(
        requireActivity: FragmentActivity,
        myPlace: String
    ): LatLng? {
        val coder = Geocoder(requireActivity)
        val address: List<Address>?
        var p1: LatLng? = null
        try {
            // May throw an IOException
            address = coder.getFromLocationName(myPlace, 5)
            if (address == null) {
                return null
            }

            val location = address[0]
            p1 = LatLng(location.latitude, location.longitude)

            strCityName = location.locality.toString()
            Log.e("currentLatLng", "   strCityName...  $strCityName")
        } catch (ex: IOException) {
            ex.printStackTrace()
        }
        return p1
    }
}











