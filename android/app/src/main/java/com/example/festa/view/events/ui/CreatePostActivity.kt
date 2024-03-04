package com.example.festa.view.events.ui

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.ContentResolver
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.provider.OpenableColumns
import android.util.Log
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.festa.application.Festa
import com.example.festa.databinding.ActivityCreatePostBinding
import com.example.festa.view.events.viewmodel.createfeeds.CreateFeedViewModel
import com.freqwency.promotr.utils.ErrorUtil
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint
import id.zelory.compressor.Compressor
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream

@AndroidEntryPoint
class CreatePostActivity : AppCompatActivity() {
    private lateinit var binding: ActivityCreatePostBinding
    private lateinit var activity: Activity
    private val CAMERA_PERMISSION_CODE = 101
    private val progressDialog by lazy { CustomProgressDialog(this) }
    private var compressedImageFile: File? = null
    private var selectedImageFile: File? = null

    private var eventId = ""
    private var userId = ""

    private val createFeedViewModel: CreateFeedViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //setContentView(R.layout.activity_create_post)

        binding = ActivityCreatePostBinding.inflate(layoutInflater)
        setContentView(binding.root)
        activity = this

        eventId = Festa.encryptedPrefs.eventIds
        userId = Festa.encryptedPrefs.UserId

        binding.relativeBackBtn.setOnClickListener {
            finish()
        }

        binding.chooseImage.setOnClickListener {
            requestCameraPermission()
        }

        binding.postTextView.setOnClickListener {
            val description = binding.description.text.toString()
            if (description.isEmpty()) {
                Toast.makeText(this@CreatePostActivity, "Please enter description", Toast.LENGTH_SHORT
                ).show()
            } else {
                createFeedApi(description)
            }
        }

        createFeedObserver()
    }

    private fun requestCameraPermission() {
        if (ContextCompat.checkSelfPermission(
                this@CreatePostActivity,
                Manifest.permission.CAMERA
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this@CreatePostActivity,
                arrayOf(Manifest.permission.CAMERA),
                CAMERA_PERMISSION_CODE
            )
        } else {
            //Permission already granted, proceed with camera operation
            selectImage()
        }
    }

    private fun selectImage() {
        val options = arrayOf<CharSequence>("Choose from Gallery", "Cancel")
        val builder = AlertDialog.Builder(this@CreatePostActivity)
        builder.setTitle("Select Image")
        builder.setItems(options) { dialog, item ->

            when {
                options[item] == "Choose from Gallery" -> openGallery()
                options[item] == "Cancel" -> dialog.dismiss()
            }
        }
        builder.show()
    }

    @SuppressLint("IntentReset")
    private fun openGallery() {
        val galleryIntent = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        galleryIntent.type = "image/*" // Allow all image types
        selectImageLauncher.launch(galleryIntent)
    }

    @OptIn(DelicateCoroutinesApi::class)
    private val selectImageLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == Activity.RESULT_OK) {
                val data = result.data
                if (data != null) {
                    val selectedImageUri = data.data
                    if (selectedImageUri != null) {
                        selectedImageFile = convertUriToFile(selectedImageUri)
                        if (selectedImageFile != null) {
                            // Now you have the image file in File format, you can use it as needed.
                            setImageOnImageView(selectedImageFile)

                            GlobalScope.launch {
                                compressedImageFile = selectedImageFile?.let {
                                    Compressor.compress(
                                        this@CreatePostActivity,
                                        it
                                    )
                                }
                            }

                            Log.e(
                                "album_id",
                                "album_id New:  $compressedImageFile    $selectedImageFile"
                            )
                        } else {
                            // Handle the case where conversion to File failed
                            showToast("Error converting URI to File")
                        }
                    } else {
                        // Handle the case where the URI is null
                        showToast("Selected image URI is null")
                    }
                } else {
                    // Handle the case where data is null
                    showToast("No data received")
                }
            } else {
                // Handle the case where the result code is not RESULT_OK
                showToast("Action canceled")
            }
        }

    private fun convertUriToFile(uri: Uri): File? {
        try {
            val inputStream: InputStream? = this@CreatePostActivity.contentResolver.openInputStream(uri)
            if (inputStream != null) {
                val fileName = getFileNameFromUri(uri)
                val outputFile = File(this@CreatePostActivity.cacheDir, fileName)
                val outputStream = FileOutputStream(outputFile)
                inputStream.use { input ->
                    outputStream.use { output ->
                        input.copyTo(output)
                    }
                }
                return outputFile
            }
        } catch (e: Exception) {
            // Log the exception for debugging purposes
            Log.e("ConversionError", "Error converting URI to File: ${e.message}", e)
        }
        return null
    }

    private fun setImageOnImageView(imageFile: File?) {
        if (imageFile != null) {
            val bitmap = MediaStore.Images.Media.getBitmap(
                this@CreatePostActivity.contentResolver,
                Uri.fromFile(imageFile)
            )

            binding.postImage.setImageBitmap(bitmap)
        }
    }

    private fun getFileNameFromUri(uri: Uri): String {
        var result: String? = null
        val contentResolver: ContentResolver = this@CreatePostActivity.contentResolver
        val cursor = contentResolver.query(uri, null, null, null, null)
        cursor?.use {
            if (it.moveToFirst()) {
                val displayNameIndex = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                if (displayNameIndex != -1) {
                    result = it.getString(displayNameIndex)
                }
            }
        }
        return result ?: "file"
    }

    private fun showToast(message: String) {
        Toast.makeText(this@CreatePostActivity, message, Toast.LENGTH_SHORT).show()
    }


    /**
     * Create Feed
     */
    private fun createFeedApi(description: String) {
        val images = MultipartBody.Part.createFormData(
            "Image",
            compressedImageFile?.name,
            RequestBody.create("*image/*".toMediaTypeOrNull(), compressedImageFile!!)
        )

        val descriptions = RequestBody.create(MultipartBody.FORM, description)

        createFeedViewModel.createFeeds(
            progressDialog,
            activity,
            eventId, userId,images,descriptions
        )
    }

    private fun createFeedObserver() {
        createFeedViewModel.progressIndicator.observe(this) {
        }
        createFeedViewModel.createFeedResponse.observe(
            this
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message

            Toast.makeText(this@CreatePostActivity, message, Toast.LENGTH_LONG).show()
            finish()
        }

        createFeedViewModel.errorResponse.observe(this) {
            ErrorUtil.handlerGeneralError(this, it)
        }
    }

}