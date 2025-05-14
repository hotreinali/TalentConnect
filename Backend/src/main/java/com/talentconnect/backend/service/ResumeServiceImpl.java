package com.talentconnect.backend.service;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.apache.http.impl.client.CloseableHttpClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.util.Map;
import java.nio.charset.StandardCharsets;

@Service
public class ResumeServiceImpl implements ResumeService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Override
    public String uploadResume(MultipartFile file, String jobSeekerId) {
        try {
            String uploadUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/raw/upload";
            long timestamp = System.currentTimeMillis() / 1000;
            String publicId = "resumes/" + jobSeekerId;

            // ✅ 构造签名串（字段必须按字典序）
            String signatureBase = "access_mode=public&public_id=" + publicId + "&timestamp=" + timestamp + "&type=upload";
            String signature = DigestUtils.sha1Hex(signatureBase + apiSecret);

            // ✅ 构建上传请求
            HttpPost post = new HttpPost(uploadUrl);
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addBinaryBody("file", file.getInputStream(), ContentType.APPLICATION_OCTET_STREAM, file.getOriginalFilename());
            builder.addTextBody("api_key", apiKey);
            builder.addTextBody("timestamp", String.valueOf(timestamp));
            builder.addTextBody("public_id", publicId);
            builder.addTextBody("signature", signature);
            builder.addTextBody("type", "upload");
            builder.addTextBody("resource_type", "auto");  // ✅ 让 Cloudinary 自动识别类型
            builder.addTextBody("access_mode", "public"); // ✅ 关键公开访问字段

            post.setEntity(builder.build());

            try (CloseableHttpClient client = HttpClientBuilder.create().build()) {
                HttpResponse response = client.execute(post);
                String responseString = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);

                System.out.println("Cloudinary raw response:");
                System.out.println(responseString);

                JSONObject json = new JSONObject(responseString);
                return json.getString("secure_url"); // ✅ 返回可直接访问的链接
            }

        } catch (Exception e) {
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }



    @Override
    public String replaceResume(MultipartFile file, String jobSeekerId) {
        // 先删除旧简历（如果存在）
        try {
            deleteResume(jobSeekerId);
        } catch (RuntimeException e) {
            System.out.println("No existing resume to delete or already deleted.");
        }

        // 再上传新简历
        return uploadResume(file, jobSeekerId);
    }


    @Override
    public String getResumeUrl(String jobSeekerId) {
        String publicId = "resumes/" + jobSeekerId + ".pdf";
        return "https://res.cloudinary.com/" + cloudName + "/raw/upload/" + publicId;
    }

    @Override
    public void deleteResume(String jobSeekerId) {
        try {
            String publicId = "resumes/" + jobSeekerId + ".pdf";

            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret
            ));

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
                    "resource_type", "raw"
            ));

            if (!"ok".equals(result.get("result"))) {
                throw new RuntimeException("Cloudinary deletion failed: " + result);
            }

        } catch (Exception e) {
            throw new RuntimeException("Delete failed: " + e.getMessage(), e);
        }
    }
}
