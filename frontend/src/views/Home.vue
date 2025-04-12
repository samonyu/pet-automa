<script setup>
import { ref, onMounted } from 'vue';

const videos = ref([]);

onMounted(async () => {
  try {
    const res = await fetch('/api/videos');
    const data = await res.json();
    if (data.success) {
      videos.value = data.data; 
    } else {
      console.error('API 返回失败:', json);
    }
  } catch (err) {
    console.error('Error fetching videos:', err);
  }
});
</script>

<template>
  <div class="video-gallery">
    <h2>视频封面展示</h2>
    <div class="video-grid">
      <div v-for="video in videos" :key="video.id" class="video-card">
        <img
          :src="video.jimg"
          alt="Video Thumbnail"
          class="video-thumbnail"
        />
        <div class="video-info">
          <h3>{{ video.jid }}</h3>
          <p>{{ video.jtitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-gallery {
  padding: 20px;
  background-color: #fafafa;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.video-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.video-card:hover {
  transform: scale(1.03);
}

.video-thumbnail {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.video-info {
  padding: 12px;
}

.video-info h3 {
  font-size: 18px;
  margin: 0 0 8px;
}

.video-info p {
  font-size: 14px;
  color: #666;
}
</style>
