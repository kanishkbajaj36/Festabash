package com.example.festa.view.cohost.ui

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.pm.PackageManager
import android.database.Cursor
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.ContactsContract
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.*
import androidx.activity.viewModels
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.festa.R
import com.example.festa.databinding.ActivityCoHostBinding
import com.example.festa.interfaces.OnItemClickListenerDelete
import com.example.festa.view.cohost.adapters.CoHostAdapter
import com.example.festa.view.cohost.viewmodel.addcohost.AddCoHostBody
import com.example.festa.view.cohost.viewmodel.addcohost.AddCoHostViewModel
import com.example.festa.view.cohost.viewmodel.cohostlist.CoHostListViewModel
import com.example.festa.view.cohost.viewmodel.cohostlist.CostHostListResponse
import com.example.festa.view.cohost.viewmodel.deletecohost.DeleteCoHostViewModel
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class CoHostActivity : AppCompatActivity(), OnItemClickListenerDelete {
    private lateinit var binding: ActivityCoHostBinding

    private lateinit var activity: Activity
    private var customAdapter: CoHostAdapter? = null
    private var cursor: Cursor? = null
    private val selectedContacts = mutableListOf<Pair<String, String>>()
    private val guestListViewModel: CoHostListViewModel by viewModels()
    private val addCoHostModel: AddCoHostViewModel by viewModels()
    private val deleteCoHostModel: DeleteCoHostViewModel by viewModels()

    private var guestList: List<CostHostListResponse.CoHostsDatum> = ArrayList()
    private val READ_CONTACTS_PERMISSION_REQUEST_CODE = 123
    var eventId = ""
    private lateinit var addPhoneBookList: ListView
    private val progressDialog by lazy { CustomProgressDialog(activity) }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCoHostBinding.inflate(layoutInflater)
        setContentView(binding.root)
        activity = this

        eventId = intent.getStringExtra("eventId").toString()

        binding.backarrowcohost.setOnClickListener {
            finish()
        }

        binding.coHostPhonebook.setOnClickListener {
            addPhoneBook()
        }

        binding.addCoHost.setOnClickListener {
            addCoHost()
        }
        // Observer......................................
        getGuestList()
        addCoHostObserver()
        guestListObserver()
        deleteObserver()
    }


    // Add CoHost Popup Method
    private fun addCoHost() {
        val dialogView = layoutInflater.inflate(R.layout.add_guest, null)
        val builder = AlertDialog.Builder(this@CoHostActivity).setView(dialogView)
        val dialog = builder.create()
        dialog.window!!.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        val clearCross = dialogView.findViewById<ImageView>(R.id.clearCross)
        val addGuestNameEdit = dialogView.findViewById<EditText>(R.id.AddGuestNameEdit)
        val addPhoneNoEdit = dialogView.findViewById<EditText>(R.id.AddPhoneNoEdit)
        val saveBtnTxt = dialogView.findViewById<TextView>(R.id.saveBtnTxt)

        saveBtnTxt.setOnClickListener {
            val name = addGuestNameEdit.text.toString()
            val phoneNumber = addPhoneNoEdit.text.toString()
            if (name.isEmpty()) {
                Toast.makeText(this@CoHostActivity, "Please enter name", Toast.LENGTH_SHORT).show()

            } else if (phoneNumber.isEmpty()) {
                Toast.makeText(this@CoHostActivity, "Please enter number", Toast.LENGTH_SHORT)
                    .show()
            } else if (phoneNumber.length != 10) {
                Toast.makeText(
                    this@CoHostActivity,
                    "Please enter 10 digit phone number",
                    Toast.LENGTH_SHORT
                ).show()
            } else {


                addCoHostApi(name, phoneNumber)
                // Notify the adapter of the new data

                dialog.dismiss()
            }

        }

        clearCross.setOnClickListener {
            dialog.dismiss()
        }

        dialog.show()
        clearCross.setOnClickListener { dialog.dismiss() }

    }

    @SuppressLint("MissingInflatedId")
    fun addPhoneBook() {
        val dialogView = layoutInflater.inflate(R.layout.add_guest_phonebook, null)
        val builder = AlertDialog.Builder(this@CoHostActivity).setView(dialogView)
        val dialog = builder.create()
        dialog.window!!.setBackgroundDrawable(ColorDrawable(Color.WHITE))
        val saveBtnTxt = dialogView.findViewById<TextView>(R.id.saveBtnTxt)
        addPhoneBookList = dialogView.findViewById(R.id.addPhoneBookList)
        val phoneBookClose = dialogView.findViewById<ImageView>(R.id.phoneBookClose)
        val searchEditText = dialogView.findViewById<EditText>(R.id.searchEditText)

        if (ContextCompat.checkSelfPermission(
                this@CoHostActivity,
                Manifest.permission.READ_CONTACTS
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            // Permission is not granted, request it
            requestPermissions(
                arrayOf(Manifest.permission.READ_CONTACTS),
                READ_CONTACTS_PERMISSION_REQUEST_CODE
            )
        } else {
            // Permission already granted, proceed with your code
            getContacts(addPhoneBookList)
        }

        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterContacts(s.toString(), addPhoneBookList)
            }

            override fun afterTextChanged(s: Editable?) {}
        })


        saveBtnTxt.setOnClickListener {
            //saveDataPre.saveCoHostContacts(personAddCoHostList)
            //  customAdapter.notifyDataSetChanged()
            for ((displayName, phoneNumber) in selectedContacts) {
                // Do something with displayName and phoneNumber, e.g., send them using addGuestApi
                Log.d(
                    "GuestFragmentAS",
                    "NameCoHostApi: $displayName phoneNumberCoHostApi: $phoneNumber selected"
                )
                addCoHostApi(displayName, phoneNumber)
            }

            // Clear the list of selected contacts
            selectedContacts.clear()
            customAdapter?.updateDataSet(guestList)
            dialog.dismiss()
        }

        dialog.show()

        phoneBookClose.setOnClickListener {
            dialog.dismiss()
        }
    }


    private fun getContacts(addPhoneBookList: ListView) {
        // create cursor and query the data
        cursor = this@CoHostActivity.contentResolver.query(
            ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
            null,
            null,
            null,
            null
        )
        this@CoHostActivity.startManagingCursor(cursor)

        // data is an array of String type which is
        // used to store Number, Names, and id.
        val data = arrayOf(
            ContactsContract.CommonDataKinds.Phone.NUMBER,
            ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME,
            ContactsContract.CommonDataKinds.Phone._ID
        )
        //   val phoneNumberPosition = data.indexOf(ContactsContract.CommonDataKinds.Phone.NUMBER)
        val to = intArrayOf(android.R.id.text1, android.R.id.text2)


        // creation of adapter using SimpleCursorAdapter class
        val adapter = SimpleCursorAdapter(
            this@CoHostActivity,
            android.R.layout.simple_list_item_2,
            cursor,
            data,
            to
        )

        // Calling setAdapter() method to set created adapter
        addPhoneBookList.adapter = adapter
        addPhoneBookList.choiceMode = ListView.CHOICE_MODE_MULTIPLE


        addPhoneBookList.setOnItemClickListener { _, _, position, _ ->
            val cursor = adapter.getItem(position) as Cursor
            handleItemClick(cursor, position, addPhoneBookList)
        }
    }


    private fun handleItemClick(cursor: Cursor, position: Int, listView: ListView) {
        val phoneNumberIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)
        val displayNameIndex =
            cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
        val contactIdIndex = cursor.getColumnIndex(ContactsContract.CommonDataKinds.Phone._ID)

        cursor.moveToPosition(position)

        val phoneNumber = cursor.getString(phoneNumberIndex)
        val displayName = cursor.getString(displayNameIndex)
        val contactId = cursor.getLong(contactIdIndex)
        Log.d("GuestFragment", "NameOuter: $displayName phoneNumberOuter: $phoneNumber selected")
        // Toggle the selection state
        val checkedItemPositions = listView.checkedItemPositions
        val isCurrentlySelected = checkedItemPositions.get(position)

        val backgroundColor = if (isCurrentlySelected) Color.YELLOW else Color.TRANSPARENT
        listView.getChildAt(position)?.setBackgroundColor(backgroundColor)

        // Update the background color based on the selection state
        if (isCurrentlySelected) {
            selectedContacts.add(Pair(displayName, phoneNumber))
            Log.d("GuestFragmentAS", "Name: $displayName phoneNumber: $phoneNumber selected")
        } else {
            selectedContacts.remove(Pair(displayName, phoneNumber))
            Log.d("GuestFragmentAS", "Name: $displayName phoneNumber: $phoneNumber unselected")
        }

        for (i in 0 until listView.childCount) {
            val childView = listView.getChildAt(i)
            val resetColor = if (checkedItemPositions.get(i)) Color.YELLOW else Color.TRANSPARENT
            childView.setBackgroundColor(resetColor)
        }

        // Update the background color based on the selection state
    }

    private fun filterContacts(query: String, addPhoneBookList: ListView) {
        cursor?.let {
            // Requery with the new filter
            val filteredCursor = this@CoHostActivity.contentResolver.query(
                ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                null,
                "${ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME} LIKE ? OR ${ContactsContract.CommonDataKinds.Phone.NUMBER} LIKE ?",
                arrayOf("%$query%", "%$query%"),
                null
            )

            // Update the adapter with the filtered cursor
            (addPhoneBookList.adapter as SimpleCursorAdapter).changeCursor(filteredCursor)
        }
    }


    // Add Guest Api
    private fun addCoHostApi(name: String, phoneNumber: String) {
        val acceptBody = AddCoHostBody(
            co_host_Name = name,
            phone_no = phoneNumber
        )

        Log.e("GuestFragmentAS", " name $name phoneNumber $phoneNumber")
        addCoHostModel.getaddcohost(progressDialog, activity, eventId, acceptBody)
    }

    private fun addCoHostObserver() {
        addCoHostModel.progressIndicator.observe(this@CoHostActivity) {
        }
        addCoHostModel.maddcohostresponse.observe(this@CoHostActivity) {
            val message = it.peekContent().message
            Toast.makeText(this@CoHostActivity, message, Toast.LENGTH_SHORT).show()
            getGuestList()
        }
        addCoHostModel.errorResponse.observe(this@CoHostActivity) {
            com.freqwency.promotr.utils.ErrorUtil.handlerGeneralError(this@CoHostActivity, it)
            // errorDialogs()
        }
    }

    // Add Guest List  API
    private fun getGuestList() {
        guestListViewModel.getguestlist(progressDialog, activity, eventId)

    }

    private fun guestListObserver() {
        guestListViewModel.progressIndicator.observe(this@CoHostActivity) {
        }
        guestListViewModel.mguestlist.observe(this@CoHostActivity) {
            val message = it.peekContent().message
            val success = it.peekContent().success

            Log.e("CoshotList", "onCreateSize: " + guestList.size)
            //binding.joinDate.text=joinDate.toString()
            if (success == true) {
                binding.coHostRecycle.visibility = View.VISIBLE
                guestList = it.peekContent().coHostsData!!

                binding.coHostRecycle.isVerticalScrollBarEnabled = true
                binding.coHostRecycle.isVerticalFadingEdgeEnabled = true
                binding.coHostRecycle.layoutManager =
                    LinearLayoutManager(this@CoHostActivity, LinearLayoutManager.VERTICAL, false)
                customAdapter = CoHostAdapter(this@CoHostActivity, guestList, this)
                binding.coHostRecycle.adapter = customAdapter
            } else {
                binding.notAnyCoHostAdded.visibility
            }

        }
        guestListViewModel.errorResponse.observe(this@CoHostActivity) {
            com.freqwency.promotr.utils.ErrorUtil.handlerGeneralError(this@CoHostActivity, it)
            // errorDialogs()
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == READ_CONTACTS_PERMISSION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted, proceed with your code
                if (::addPhoneBookList.isInitialized) {
                    getContacts(addPhoneBookList)
                } else {
                    // Handle the case where the ListView is not initialized
                    Log.e("YourTag", "addPhoneBookList is not initialized")
                }
            } else {
                // Permission denied, handle it accordingly
                // You may want to inform the user or take alternative actions
                Toast.makeText(
                    this@CoHostActivity,
                    "Permission denied. Cannot load contacts.",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    override fun onDeleteClick(position: Int, id: String) {
        deleteGuest(id)
    }

    // Delete Guest Api
    private fun deleteGuest(guestId: String) {
        deleteCoHostModel.deleteGuest(progressDialog, activity, guestId, eventId)
    }

    private fun deleteObserver() {
        deleteCoHostModel.progressIndicator.observe(this@CoHostActivity) {
        }
        deleteCoHostModel.mDeleteResponse.observe(this@CoHostActivity) {
            val message = it.peekContent().message
            Toast.makeText(this@CoHostActivity, message, Toast.LENGTH_SHORT).show()
            getGuestList()

        }
        deleteCoHostModel.errorResponse.observe(this@CoHostActivity) {
            com.freqwency.promotr.utils.ErrorUtil.handlerGeneralError(this@CoHostActivity, it)

        }
    }
}