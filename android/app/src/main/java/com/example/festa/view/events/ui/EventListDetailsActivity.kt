package com.example.festa.view.events.ui

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.provider.MediaStore
import android.provider.OpenableColumns
import android.text.Editable
import android.util.Log
import android.util.TypedValue
import android.view.*
import android.view.animation.Animation
import android.view.animation.TranslateAnimation
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.festa.R
import com.example.festa.adapters.FeedAdapter
import com.example.festa.adapters.GalleryAdapter
import com.example.festa.application.Festa
import com.example.festa.classes.RecyclerTouchListener
import com.example.festa.databinding.ActivityEventListDetailsBinding
import com.example.festa.interfaces.OnItemClickListenerDeleteImage
import com.example.festa.interfaces.RefreshInterface
import com.example.festa.view.events.adapters.CommentAdapter
import com.example.festa.view.events.adapters.PhotosAdapter
import com.example.festa.view.events.viewmodel.addimagealbum.AddImageInAlbumViewModel
import com.example.festa.view.events.viewmodel.allalbumshow.AllAlbumResponse
import com.example.festa.view.events.viewmodel.allalbumshow.AllAlbumViewModel
import com.example.festa.view.events.viewmodel.commentinfeed.CommentOnFeedBody
import com.example.festa.view.events.viewmodel.commentinfeed.CommentOnFeedViewModel
import com.example.festa.view.events.viewmodel.commentlist.CommentListResponse
import com.example.festa.view.events.viewmodel.commentlist.CommentListViewModel
import com.example.festa.view.events.viewmodel.createNewAlbum.CreateAlbumBody
import com.example.festa.view.events.viewmodel.createNewAlbum.CreateNewAlbumViewModel
import com.example.festa.view.events.viewmodel.deletealbum.DeleteAlbumViewModel
import com.example.festa.view.events.viewmodel.deletefeeds.DeleteFeedViewModel
import com.example.festa.view.events.viewmodel.deleteimgfromalbum.DeleteImageFromAlbumViewModel
import com.example.festa.view.events.viewmodel.feedslikedislike.FeedLikeDislikeViewModel
import com.example.festa.view.events.viewmodel.feedslist.FeedsListResponse
import com.example.festa.view.events.viewmodel.feedslist.FeedsListViewModel
import com.example.festa.view.events.viewmodel.particularalbumimageslist.ParticularAlbumImagesViewModel
import com.example.festa.view.events.viewmodel.renamealbum.RenameAlbumBody
import com.example.festa.view.events.viewmodel.renamealbum.RenameAlbumNameViewModel
import com.freqwency.promotr.utils.ErrorUtil
import com.johncodeos.customprogressdialogexample.CustomProgressDialog
import dagger.hilt.android.AndroidEntryPoint
import id.zelory.compressor.Compressor
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.*
import kotlin.math.roundToInt

@AndroidEntryPoint
class EventListDetailsActivity : AppCompatActivity(), OnItemClickListenerDeleteImage,
    RefreshInterface {
    lateinit var binding: ActivityEventListDetailsBinding

    private var pickImage: ImageSwitcher? = null
    private var mArrayUri: ArrayList<Uri>? = null
    private val CAMERA_PERMISSION_CODE = 101
    private var scaleGestureDetector: ScaleGestureDetector? = null
    private var mScaleFactor = 1.0f
    private val uri = ArrayList<Uri>()
    private var eventId = ""
    private var userId = ""
    private var createdUserId = ""
    private var albumIds = ""
    private var albumName = ""
    private var feedIds = ""
    private var enterType = ""

    private val allAlbumViewModel: AllAlbumViewModel by viewModels()
    private val createNewAlbumViewModel: CreateNewAlbumViewModel by viewModels()
    private val addImageInAlbumViewModel: AddImageInAlbumViewModel by viewModels()
    private val particularAlbumImagesViewModel: ParticularAlbumImagesViewModel by viewModels()
    private val renameAlbumNameViewModel: RenameAlbumNameViewModel by viewModels()
    private val deleteImageFromAlbumViewModel: DeleteImageFromAlbumViewModel by viewModels()
    private val deleteAlbumViewModel: DeleteAlbumViewModel by viewModels()

    private val feedsListViewModel: FeedsListViewModel by viewModels()
    private val commentOnFeedViewModel: CommentOnFeedViewModel by viewModels()
    private val commentListViewModel: CommentListViewModel by viewModels()
    private val feedLikeDislikeViewModel: FeedLikeDislikeViewModel by viewModels()
    private val deleteFeedViewModel: DeleteFeedViewModel by viewModels()
    private val progressDialog by lazy { CustomProgressDialog(this@EventListDetailsActivity) }
    private lateinit var createAlbumBody: CreateAlbumBody
    private lateinit var renameAlbumBody: RenameAlbumBody
    private lateinit var commentOnFeedBody: CommentOnFeedBody

    private var compressedImageFile: File? = null
    private var selectedImageFile: File? = null
    private var list: ArrayList<AllAlbumResponse.Albums> =
        ArrayList()

    private var feedsListResponse = ArrayList<FeedsListResponse.Feeds>()

    private var refreshInterface: RefreshInterface? = null
    private var feedAdapter: FeedAdapter? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_event_list_details)

        refreshInterface = this
        eventId = Festa.encryptedPrefs.eventIds
        userId = Festa.encryptedPrefs.UserId

        enterType = intent.getStringExtra("enterType").toString()
        createdUserId = intent.getStringExtra("userIds").toString()


        Log.e("createdUserIdA","createdUserIdActr " + createdUserId  +" userdId " +userId)
        /* val topLayoutManager: RecyclerView.LayoutManager = GridLayoutManager(context, 3)
         binding.photorecycle.layoutManager = topLayoutManager
         binding.photorecycle.addItemDecoration(GridSpacingItemDecoration(3, dpToPx(), true))
         binding.photorecycle.itemAnimator = DefaultItemAnimator()
         binding.photorecycle.layoutManager = topLayoutManager*/

        feedsListResponse = ArrayList()

        binding.backarrowLayout.setOnClickListener { finish() }

        binding.feedrecycle.layoutManager = LinearLayoutManager(this@EventListDetailsActivity)
        feedAdapter = FeedAdapter(this@EventListDetailsActivity, feedsListResponse, this,createdUserId)
        binding.feedrecycle.adapter = feedAdapter



        if (createdUserId == userId)
        {
            binding.addNewPostCarview.visibility = View.VISIBLE
            binding.createalbumLinear.visibility = View.VISIBLE
            binding.addImageInAlbumBtn.visibility = View.VISIBLE
            binding.threeDotBtn.visibility = View.VISIBLE

        }
        else
        {
            binding.addNewPostCarview.visibility = View.GONE
            binding.createalbumLinear.visibility = View.GONE
            binding.addImageInAlbumBtn.visibility = View.GONE
            binding.threeDotBtn.visibility = View.GONE

        }

        when (enterType) {
            "event" -> {
                allFeedsListApi()
                binding.feedbg.visibility = View.VISIBLE
                binding.feedrecycle.visibility = View.VISIBLE
              // binding.addNewPostCarview.visibility = View.VISIBLE
            }
            "chat" -> {
                binding.chatandupdatepage.visibility = View.VISIBLE
                val animation: Animation = TranslateAnimation(1000f, 0f, 0f, 0f)
                animation.duration = 500
                //binding.photorecycle.startAnimation(animation)
                //binding.addphotos.setVisibility(View.GONE)
                binding.addNewPostCarview.visibility = View.GONE
                binding.feedbg.visibility = View.GONE
                binding.feedrecycle.visibility = View.GONE

                binding.nestedLayout.visibility = View.GONE

                binding.chatdbg.visibility = View.VISIBLE
                binding.photobg.visibility = View.GONE

                binding.albumImgLayout.visibility = View.GONE
                binding.feedbtn.setBackgroundResource(0)
                binding.photobtn.setBackgroundResource(0)
            }
            "photo" -> {
                binding.photorecycle.visibility = View.VISIBLE
                binding.nestedLayout.visibility = View.VISIBLE
                binding.photobg.visibility = View.VISIBLE

                binding.addNewPostCarview.visibility = View.GONE
                binding.feedbg.visibility = View.GONE
                binding.feedrecycle.visibility = View.GONE

                binding.chatdbg.visibility = View.GONE
                binding.chatandupdatepage.visibility = View.GONE
                binding.chatbtn.setBackgroundResource(0)
                binding.feedbtn.setBackgroundResource(0)
                allAlbumApi()
            }
        }


        //............guestrecycle...............

        binding.feedbtn.setOnClickListener {
            binding.feedrecycle.visibility = View.VISIBLE

            if (createdUserId == userId)
            {
                binding.addNewPostCarview.visibility = View.VISIBLE
            }
            else
            {
                binding.addNewPostCarview.visibility = View.GONE
            }

            /*  val animation: Animation = TranslateAnimation(0f, 1000f, 0f, 0f)
              animation.duration = 1000*/
            //binding.chatandupdatepage.startAnimation(animation)
            //binding.addphotos.setVisibility(View.GONE)
            binding.albumImgLayout.visibility = View.GONE
            binding.nestedLayout.visibility = View.GONE

            binding.feedbg.visibility = View.VISIBLE
            binding.photobg.visibility = View.GONE
            binding.chatdbg.visibility = View.GONE
            binding.chatandupdatepage.visibility = View.GONE

            binding.photobtn.setBackgroundResource(0)
            binding.chatbtn.setBackgroundResource(0)
            allFeedsListApi()
        }

        binding.chatbtn.setOnClickListener {
            binding.chatandupdatepage.visibility = View.VISIBLE
            val animation: Animation = TranslateAnimation(1000f, 0f, 0f, 0f)
            animation.duration = 500
            //binding.photorecycle.startAnimation(animation)
            //binding.addphotos.setVisibility(View.GONE)
            binding.addNewPostCarview.visibility = View.GONE
            binding.feedbg.visibility = View.GONE
            binding.feedrecycle.visibility = View.GONE

            binding.nestedLayout.visibility = View.GONE

            binding.chatdbg.visibility = View.VISIBLE
            binding.photobg.visibility = View.GONE

            binding.albumImgLayout.visibility = View.GONE
            binding.feedbtn.setBackgroundResource(0)
            binding.photobtn.setBackgroundResource(0)
        }

        binding.photobtn.setOnClickListener {
            binding.photorecycle.visibility = View.VISIBLE
            binding.nestedLayout.visibility = View.VISIBLE
            binding.photobg.visibility = View.VISIBLE

            binding.addNewPostCarview.visibility = View.GONE
            binding.feedbg.visibility = View.GONE
            binding.feedrecycle.visibility = View.GONE

            binding.chatdbg.visibility = View.GONE
            binding.chatandupdatepage.visibility = View.GONE
            binding.chatbtn.setBackgroundResource(0)
            binding.feedbtn.setBackgroundResource(0)
            allAlbumApi()
        }



        binding.addNewPostBtn.setOnClickListener {
            val intent = Intent(this@EventListDetailsActivity, CreatePostActivity::class.java)
            startActivity(intent)
        }

        binding.picimagerecycle1.addOnItemTouchListener(
            RecyclerTouchListener(
                this@EventListDetailsActivity,
                binding.picimagerecycle1,
                object : RecyclerTouchListener.ClickListener {
                    override fun onClick(view: View?, position: Int) {
                        albumIds = list[position].album_id
                        particularAlbumApi(albumIds)
                        Log.e("albumIds", "albumIds:  $albumIds")
                    }

                    override fun onLongClick(view: View?, position: Int) {}
                })
        )

        Glide
            .with(this@EventListDetailsActivity)
            .load(R.drawable.baseline_add_circle_outline_24)
            .into(binding.addImageBtn)

        Glide
            .with(this@EventListDetailsActivity)
            .load(R.drawable.three_dot_icon)
            .into(binding.threeDotBtn)

        Glide
            .with(this@EventListDetailsActivity)
            .load(R.drawable.table)
            .into(binding.threeColumBtn)

        Glide
            .with(this@EventListDetailsActivity)
            .load(R.drawable.border)
            .into(binding.twoColumBtn)

        Glide
            .with(this@EventListDetailsActivity)
            .load(R.drawable.upload_image)
            .into(binding.addImageInAlbumBtn)

        mArrayUri = ArrayList()
        scaleGestureDetector = ScaleGestureDetector(this@EventListDetailsActivity, ScaleListener())

        if (ContextCompat.checkSelfPermission(
                this@EventListDetailsActivity,
                Manifest.permission.READ_EXTERNAL_STORAGE
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this@EventListDetailsActivity,
                arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE),
                Read_Permission
            )
        }

        binding.pickImageBtn.setOnClickListener {
            createAlbumDialog()
        }

        binding.threeDotBtn.setOnClickListener {
            //val wrapper: Context = ContextThemeWrapper(applicationContext, R.style.PopupMenu_style)
            val popupMenu = PopupMenu(this@EventListDetailsActivity, binding.threeDotBtn)
            popupMenu.menuInflater.inflate(R.menu.menu_list, popupMenu.menu)
            popupMenu.setOnMenuItemClickListener { item ->
                when (item.itemId) {
                    R.id.renameAlbum -> {
                        renameAlbumDialog(albumName)
                        true
                    }
                    R.id.deleteAlbum -> {
                        deleteAlbumDialog(albumIds)
                        true
                    }
                    else -> false
                }
            }
            popupMenu.show()
        }

        binding.twoColumBtn.setOnClickListener {
            particularAlbumObserver(2)
            binding.twoColumBtn.setColorFilter(resources.getColor(R.color.grey1, null))
            binding.threeColumBtn.setColorFilter(resources.getColor(R.color.secondryblack, null))
        }

        binding.threeColumBtn.setOnClickListener {
            particularAlbumObserver(3)
            binding.twoColumBtn.setColorFilter(resources.getColor(R.color.secondryblack, null))
            binding.threeColumBtn.setColorFilter(resources.getColor(R.color.grey1, null))
        }

        binding.addImageInAlbumBtn.setOnClickListener {
            //val intent = Intent()
            // intent.type = "image/*"
            /* if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
                 intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
             }*/
            /* intent.action = Intent.ACTION_GET_CONTENT
             startActivityForResult(Intent.createChooser(intent, "select Picture"), 1)*/

            requestCameraPermission()
        }

        allAlbumObserver()
        createNewAlbumObserver()
        addImgInAlbumObserver()
        particularAlbumObserver(3)
        renameAlbumObserver()
        deleteImgFromAlbumObserver()
        deleteAlbumObserver()

        allFeedsListObserver()
        addCommentOnFeedObserver()
        allCommentShowObserver()
        feedLikeDislikeObserver()
        deleteFeedObserver()
    }

    override fun onStart() {
        super.onStart()
        refreshInterface!!.Refresh()
    }

    private fun requestCameraPermission() {
        if (ContextCompat.checkSelfPermission(
                this@EventListDetailsActivity,
                Manifest.permission.CAMERA
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this@EventListDetailsActivity,
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
        val builder = AlertDialog.Builder(this@EventListDetailsActivity)
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
                                        this@EventListDetailsActivity,
                                        it
                                    )
                                }
                            }

                            Log.e(
                                "album_id",
                                "album_id New:  $compressedImageFile    $selectedImageFile"
                            )
                            addImgInAlbumApi(albumIds)
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
            val inputStream: InputStream =
                this@EventListDetailsActivity.contentResolver.openInputStream(uri)!!
            if (inputStream != null) {
                val fileName = getFileNameFromUri(uri)
                val outputFile = File(this@EventListDetailsActivity.cacheDir, fileName)
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
                this@EventListDetailsActivity.contentResolver,
                Uri.fromFile(imageFile)
            )
        }
    }

    private fun getFileNameFromUri(uri: Uri): String {
        var result: String? = null
        val contentResolver: ContentResolver = this@EventListDetailsActivity.contentResolver
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
        Toast.makeText(this@EventListDetailsActivity, message, Toast.LENGTH_SHORT).show()
    }


    /**
     * Create New Album Dialog
     */
    @SuppressLint("MissingInflatedId")
    private fun createAlbumDialog() {
        val dialogView = layoutInflater.inflate(R.layout.create_new_album, null)
        val builder = AlertDialog.Builder(this@EventListDetailsActivity).setView(dialogView)
        val dialog = builder.create()
        val newAlbumTitle = dialogView.findViewById<TextView>(R.id.newAlbumTitle)
        val saveAlbumBtn = dialogView.findViewById<TextView>(R.id.saveAlbumBtn)
        dialog.window!!.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        dialog.show()
        dialog.setCancelable(true)

        saveAlbumBtn.setOnClickListener {
            val newAlbumTitles = newAlbumTitle.text.toString()
            if (newAlbumTitles.isEmpty()) {
                Toast.makeText(
                    this@EventListDetailsActivity, "Please enter album name", Toast.LENGTH_SHORT
                ).show()
            } else {
                createNewAlbumApi(newAlbumTitles)
                dialog.dismiss()
            }
        }
    }

    /**
     * Create New Album
     */
    private fun createNewAlbumApi(paramObject: String) {
        createAlbumBody = CreateAlbumBody(
            albumName = paramObject
        )
        createNewAlbumViewModel.createNewAlbums(
            progressDialog,
            this@EventListDetailsActivity,
            eventId, createAlbumBody
        )
    }

    private fun createNewAlbumObserver() {
        createNewAlbumViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        createNewAlbumViewModel.createNewAlbumResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message

            Toast.makeText(this@EventListDetailsActivity, message, Toast.LENGTH_LONG).show()
            allAlbumApi()
        }

        createNewAlbumViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    /**
     * Show All Album List
     */
    private fun allAlbumApi() {
        allAlbumViewModel.getAllAlbum(
            progressDialog,
            this@EventListDetailsActivity,
            eventId
        )
    }

    private fun allAlbumObserver() {
        allAlbumViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        allAlbumViewModel.allAlbumResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            binding.albumImgLayout.visibility = View.GONE
            if (success!!) {
                //val list = it.peekContent().albums
                list = it.peekContent().albums

                binding.albumImgLayout.visibility = View.VISIBLE
                albumIds = it.peekContent().albums[0].album_id
                albumName = it.peekContent().albums[0].album_name
                particularAlbumApi(albumIds)
                binding.picimagerecycle1.isHorizontalScrollBarEnabled = true
                binding.picimagerecycle1.isHorizontalFadingEdgeEnabled = true
                //binding.rcvPromoter.layoutManager = GridLayoutManager(activity, 3, GridLayoutManager.HORIZONTAL, false)
                binding.picimagerecycle1.layoutManager =
                    LinearLayoutManager(
                        this@EventListDetailsActivity,
                        RecyclerView.HORIZONTAL,
                        false
                    )
                binding.picimagerecycle1.adapter =
                    GalleryAdapter(this@EventListDetailsActivity, list)
            }
        }

        allAlbumViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    /**
     * Add Image in Album
     */
    private fun addImgInAlbumApi(album_id: String) {
        // val images = MultipartBody.Part.createFormData("images", compressedImageFile?.name, RequestBody.create("image/*".toMediaTypeOrNull(), compressedImageFile!!))
        Log.e("album_id", "album_id New:  $album_id  $selectedImageFile")

        val images = MultipartBody.Part.createFormData(
            "images",
            selectedImageFile?.name,
            selectedImageFile!!.asRequestBody("*image/*".toMediaTypeOrNull())
        )

        addImageInAlbumViewModel.getAddImageInAlbum(
            progressDialog,
            this@EventListDetailsActivity,
            images, album_id
        )
    }

    private fun addImgInAlbumObserver() {
        addImageInAlbumViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        addImageInAlbumViewModel.addImageInAlbumReponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message

            Toast.makeText(this@EventListDetailsActivity, message, Toast.LENGTH_LONG).show()
            particularAlbumApi(albumIds)
        }

        addImageInAlbumViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    /**
     * Particular Album Show Images
     */
    fun particularAlbumApi(albumIds: String) {
        particularAlbumImagesViewModel.getParticularAlbumImages(
            progressDialog,
            this@EventListDetailsActivity, eventId, albumIds
        )
    }

    private fun particularAlbumObserver(counts: Int) {
        particularAlbumImagesViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        particularAlbumImagesViewModel.particularAlbumImagesResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            if (success!!) {
                val list = it.peekContent().imageEntries
                val userId = it.peekContent().userId

                val albumIds = it.peekContent().albumId
                binding.albumTitle.text = it.peekContent().albumName
                albumName = it.peekContent().albumName!!
                //list = it.peekContent().albums
                binding.photorecycle.layoutManager =
                    GridLayoutManager(
                        this@EventListDetailsActivity,
                        counts,
                        LinearLayoutManager.VERTICAL,
                        false
                    )
                val photosAdapter =
                    list?.let { it1 -> PhotosAdapter(it1, this@EventListDetailsActivity, albumIds, this, counts,createdUserId) }
                binding.photorecycle.adapter = photosAdapter
            }
        }

        particularAlbumImagesViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    /**
     * Rename Album Name Dialog
     */
    @SuppressLint("MissingInflatedId")
    private fun renameAlbumDialog(albumName: String) {
        val dialogView = layoutInflater.inflate(R.layout.create_new_album, null)
        val builder = AlertDialog.Builder(this@EventListDetailsActivity).setView(dialogView)
        val dialog = builder.create()
        val newAlbumTitle = dialogView.findViewById<EditText>(R.id.newAlbumTitle)
        val saveAlbumBtn = dialogView.findViewById<TextView>(R.id.saveAlbumBtn)
        dialog.window!!.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        dialog.show()
        dialog.setCancelable(true)

        //newAlbumTitle.setText(albumName)
        newAlbumTitle.text = Editable.Factory.getInstance().newEditable(albumName)

        saveAlbumBtn.setOnClickListener {
            val newAlbumTitles = newAlbumTitle.text.toString()
            if (newAlbumTitles.isEmpty()) {
                Toast.makeText(
                    this@EventListDetailsActivity, "Please enter album name", Toast.LENGTH_SHORT
                ).show()
            } else {
                renameAlbumApi(newAlbumTitles)
                dialog.dismiss()
            }
        }
    }

    /**
     * Rename Album Name
     */
    private fun renameAlbumApi(paramObject: String) {
        renameAlbumBody = RenameAlbumBody(
            new_album_name = paramObject
        )
        renameAlbumNameViewModel.getRenameAlbumName(
            progressDialog,
            this@EventListDetailsActivity, albumIds, renameAlbumBody
        )
    }

    private fun renameAlbumObserver() {
        renameAlbumNameViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        renameAlbumNameViewModel.renameAlbumNameResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message
            allAlbumApi()
            Toast.makeText(this@EventListDetailsActivity, message, Toast.LENGTH_LONG).show()
        }

        renameAlbumNameViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    /**
     * Delete Album Dialog
     */
    @SuppressLint("MissingInflatedId")
    private fun deleteAlbumDialog(albumIds: String) {
        val dialogView = layoutInflater.inflate(R.layout.delete_guest_layout, null)
        val builder = AlertDialog.Builder(this@EventListDetailsActivity).setView(dialogView)
        val dialog = builder.create()
        val noDialog = dialogView.findViewById<LinearLayout>(R.id.noDialog)
        val yesDialog = dialogView.findViewById<LinearLayout>(R.id.yesDialog)
        val titleTxt = dialogView.findViewById<TextView>(R.id.titleTxt)
        //dialog.window!!.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        dialog.show()
        dialog.setCancelable(true)

        titleTxt.text = resources.getString(R.string.delete_album)

        noDialog.setOnClickListener { dialog.dismiss() }

        yesDialog.setOnClickListener {
            deleteAlbumApi(albumIds)
            dialog.dismiss()
        }
    }

    /**
     * Delete Album
     */
    private fun deleteAlbumApi(album_id: String) {
        deleteAlbumViewModel.getDeleteAlbum(
            progressDialog,
            this@EventListDetailsActivity, album_id
        )
    }

    private fun deleteAlbumObserver() {
        deleteAlbumViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        deleteAlbumViewModel.deleteAlbumResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message
            Toast.makeText(this@EventListDetailsActivity, message, Toast.LENGTH_LONG).show()
            allAlbumApi()
        }

        deleteAlbumViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    /**
     * Show All Feeds List
     */
    private fun allFeedsListApi() {
        feedsListViewModel.allFeedsList(
            progressDialog,
            this@EventListDetailsActivity,
            eventId
        )
    }

    @SuppressLint("NotifyDataSetChanged")
    private fun allFeedsListObserver() {
        feedsListViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        feedsListViewModel.feedsListResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            if (success!!) {
                val list = it.peekContent().feeds
                feedAdapter?.addFeeds(list)

                /* binding.feedrecycle.layoutManager = LinearLayoutManager(context)
                 val feedAdapter = FeedAdapter(this@CoHostActivity, list , this)
                 binding.feedrecycle.adapter = feedAdapter*/
            }
        }

        feedsListViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    private fun dpToPx(): Int {
        val r = resources
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            8f,
            r.displayMetrics
        ).roundToInt()
    }

    override fun onTouchEvent(motionEvent: MotionEvent): Boolean {
        scaleGestureDetector!!.onTouchEvent(motionEvent)
        return true
    }

    private inner class ScaleListener : ScaleGestureDetector.SimpleOnScaleGestureListener() {
        override fun onScale(scaleGestureDetector: ScaleGestureDetector): Boolean {
            mScaleFactor *= scaleGestureDetector.scaleFactor
            //mScaleFactor = Math.max(0.1f, Math.min(mScaleFactor, 10.0f))
            mScaleFactor = Math.max(0.1f, Math.min(mScaleFactor, 10.0f))
            pickImage!!.scaleX = mScaleFactor
            pickImage!!.scaleY = mScaleFactor
            return true
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        try {
            if ((requestCode == 1) && (resultCode == RESULT_OK)) {
                /*val selectedImageURI = data!!.data
                val path: String = getPathFromURI(selectedImageURI!!)!!

                if (path != null) {
                    //api call
                    profileImage = File(path)

                    Log.v("Path", "path:  $path $profileImage")

                    GlobalScope.launch {
                        compressedImageFile = profileImage?.let {
                            Compressor.compress(
                                this@CoHostActivity,
                                it
                            )
                        }
                    }

                    addImgInAlbumApi(albumIds)
                }*/

                if (data!!.clipData != null) {
                    val x = data.clipData!!.itemCount
                    for (i in 0 until x) {
                        uri.add(data.clipData!!.getItemAt(i).uri)
                    }
                    //galleryAdapter!!.notifyDataSetChanged()
                } else if (data.data != null) {
                    val imageUrl = data.data!!.path
                    uri.add(Uri.parse(imageUrl))
                    //galleryAdapter!!.notifyDataSetChanged()
                }
            }
        } catch (e: IndexOutOfBoundsException) {
            // Handle the exception
        }
    }

    private fun getPathFromURI(contentUri: Uri): String? {
        var res: String? = null
        val proj = arrayOf(MediaStore.Images.Media.DATA)
        val cursor = this@EventListDetailsActivity.contentResolver?.query(
            contentUri,
            proj,
            null,
            null,
            null
        )
        if (Objects.requireNonNull(cursor)!!.moveToFirst()) {
            val columnIndex = cursor!!.getColumnIndexOrThrow(MediaStore.Images.Media.DATA)
            res = cursor.getString(columnIndex)
        }
        cursor!!.close()
        return res
    }

    @SuppressLint("NotifyDataSetChanged")
    private fun removeLastImage() {
        try {
            if (uri.isNotEmpty()) {
                uri.removeAt(uri.size - 1)
                //galleryAdapter?.notifyDataSetChanged()
            }
        } catch (e: IndexOutOfBoundsException) {
            // Handle the exception
        }
    }

    companion object {
        private const val Read_Permission = 101
    }

    override fun onDeleteImageClick(position: Int, image_Id: String, album_ids: String?) {

        deleteImgFromAlbumApi(image_Id, album_ids)
    }

    override fun onAddCommentClick(feedId: String) {
        feedIds = feedId
        allCommentShowApi(feedIds)
    }

    override fun onLikeDislikeClick(feedId: String) {
        feedIds = feedId
        feedLikeDislikeApi(feedIds)
    }

    override fun onFeedDeleteClick(feedId: String) {
        feedIds = feedId
        deleteFeedDialog(feedIds)
    }

    /**
     * Delete Image From Album
     */
    private fun deleteImgFromAlbumApi(image_Ids: String, album_id: String?) {
        album_id?.let {
            deleteImageFromAlbumViewModel.getDeleteImgFromAlbum(
                progressDialog,
                this@EventListDetailsActivity, image_Ids, it
            )
        }
    }

    private fun deleteImgFromAlbumObserver() {
        deleteImageFromAlbumViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        deleteImageFromAlbumViewModel.deleteImageFromAlbumResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message
            Toast.makeText(this@EventListDetailsActivity, message, Toast.LENGTH_LONG).show()
            particularAlbumApi(albumIds)
        }

        deleteImageFromAlbumViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    /**
     * All Comment Show
     */
    private fun allCommentShowApi(feedIds: String) {
        commentListViewModel.allCommentLists(
            progressDialog,
            this@EventListDetailsActivity, feedIds
        )
    }

    private fun allCommentShowObserver() {
        commentListViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        commentListViewModel.commentListResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message
            val list = it.peekContent().all_comments
            //Toast.makeText(this@CoHostActivity, message, Toast.LENGTH_LONG).show()
            // refreshInterface?.Refresh()
            comments(list)
        }

        commentListViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    @SuppressLint("InflateParams")
    private fun comments(list: ArrayList<CommentListResponse.AllComments>) {
        val layoutInflater =
            this@EventListDetailsActivity.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val customView: View = layoutInflater.inflate(R.layout.comment_pop_up_window, null)
        val commentRecyclerView = customView.findViewById<RecyclerView>(R.id.comment_recycler_view)
        val commentEdt = customView.findViewById<EditText>(R.id.txt_comment)
        val sendComment = customView.findViewById<ImageView>(R.id.img_comment_sent)
        val dismissPopup = customView.findViewById<ImageView>(R.id.dismiss_popup_icon)
        val popupWindow = PopupWindow(
            customView,
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT,
            true
        )

        popupWindow.animationStyle = R.style.popup_window_animation
        popupWindow.showAtLocation(customView, Gravity.BOTTOM, 40, 60)

        val linearLayoutManager =
            LinearLayoutManager(this@EventListDetailsActivity, LinearLayoutManager.VERTICAL, false)
        commentRecyclerView.layoutManager = linearLayoutManager
        val adapter = CommentAdapter(list, this@EventListDetailsActivity)
        commentRecyclerView.adapter = adapter

        dismissPopup.setOnClickListener { popupWindow.dismiss() }
        sendComment.setOnClickListener {
            val strcomment = commentEdt.text.toString()
            if (strcomment == "") {
                Toast.makeText(
                    this@EventListDetailsActivity,
                    this@EventListDetailsActivity.getString(R.string.comment),
                    Toast.LENGTH_SHORT
                )
                    .show()
                commentEdt.requestFocus()
            } else {
                // post_comment(str_edt_comment, post_id, comment_edt)
                addCommentOnFeedApi(feedIds, strcomment)
                commentEdt.setText("")
                popupWindow.dismiss()
            }
        }
    }

    /**
     * Add Comment On Feed
     */
    private fun addCommentOnFeedApi(feedIds: String, strcomments: String) {
        commentOnFeedBody = CommentOnFeedBody(
            comment = strcomments
        )
        commentOnFeedViewModel.addCommentOnFeeds(
            progressDialog,
            this@EventListDetailsActivity, feedIds, userId, commentOnFeedBody
        )
    }

    private fun addCommentOnFeedObserver() {
        commentOnFeedViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        commentOnFeedViewModel.commentOnFeedResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message
            Toast.makeText(this@EventListDetailsActivity, message, Toast.LENGTH_LONG).show()
            refreshInterface?.Refresh()
        }

        commentOnFeedViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    /**
     * Feed Like Dislike
     */
    private fun feedLikeDislikeApi(feedIds: String) {
        feedLikeDislikeViewModel.getFeedLikeDislike(
            progressDialog,
            this@EventListDetailsActivity, feedIds, userId
        )
    }

    private fun feedLikeDislikeObserver() {
        feedLikeDislikeViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        feedLikeDislikeViewModel.feedLikeDislikeResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message
            Toast.makeText(this@EventListDetailsActivity, message, Toast.LENGTH_LONG).show()
            allFeedsListApi()
        }

        feedLikeDislikeViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    /**
     * Delete Feed Dialog
     */
    @SuppressLint("MissingInflatedId")
    private fun deleteFeedDialog(feedIds: String) {
        val dialogView = layoutInflater.inflate(R.layout.delete_guest_layout, null)
        val builder = AlertDialog.Builder(this@EventListDetailsActivity).setView(dialogView)
        val dialog = builder.create()
        val noDialog = dialogView.findViewById<LinearLayout>(R.id.noDialog)
        val yesDialog = dialogView.findViewById<LinearLayout>(R.id.yesDialog)
        val titleTxt = dialogView.findViewById<TextView>(R.id.titleTxt)
        //dialog.window!!.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        dialog.show()
        dialog.setCancelable(true)

        titleTxt.text = resources.getString(R.string.delete_album)

        noDialog.setOnClickListener { dialog.dismiss() }

        yesDialog.setOnClickListener {
            deleteFeedApi(feedIds)
            dialog.dismiss()
        }
    }

    /**
     * Delete Feed
     */
    private fun deleteFeedApi(feedId: String) {
        deleteFeedViewModel.getDeleteFeed(
            progressDialog,
            this@EventListDetailsActivity, feedId, userId
        )
    }

    private fun deleteFeedObserver() {
        deleteFeedViewModel.progressIndicator.observe(this@EventListDetailsActivity) {
        }
        deleteFeedViewModel.deleteFeedResponse.observe(
            this@EventListDetailsActivity
        ) {
            val success = it.peekContent().success
            val message = it.peekContent().message
            Toast.makeText(this@EventListDetailsActivity, message, Toast.LENGTH_LONG).show()
            allFeedsListApi()
        }

        deleteFeedViewModel.errorResponse.observe(this@EventListDetailsActivity) {
            ErrorUtil.handlerGeneralError(this@EventListDetailsActivity, it)
        }
    }


    override fun Refresh() {
        allFeedsListApi()
    }
}