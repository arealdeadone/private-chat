$(document).ready(function(){
    $('#upload-input').on('change', function(){
        var uploadInput = $('#upload-input');

        if(uploadInput.val() != ''){
            var formData = new FormData();

            formData.append('upload', uploadInput[0].files[0]);

            $.ajax({
                url: '/uploadFile',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    uploadInput.val('');
                    console.log(data);
                    $('#fileURL').val(data.fileURL);
                    $('#groupForm').submit();
                }
            })
        }
    })
});