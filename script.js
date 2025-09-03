const apiUrl = 'http://localhost/todo-app/api/index.php'; // تأكد من المسار الصحيح
const todoForm = document.getElementById('todo-form');
const newTaskInput = document.getElementById('new-task-title');
const taskList = document.getElementById('task-list');

// دالة لجلب وعرض المهام
async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        taskList.innerHTML = ''; // مسح القائمة الحالية

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id; // تخزين ID المهمة في عنصر الـ li
            li.classList.toggle('completed', task.completed); // إضافة كلاس 'completed' إذا كانت المهمة مكتملة

            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-title">${task.title}</span>
                </div>
                <button class="delete-btn">حذف</button>
            `;

            // إضافة مستمعي الأحداث للعناصر المنشأة
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTaskCompleted(task.id, checkbox.checked));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// دالة لإضافة مهمة جديدة
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = newTaskInput.value.trim();
    if (!title) return;

    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        newTaskInput.value = ''; // مسح حقل الإدخال
        fetchTasks(); // تحديث قائمة المهام
    } catch (error) {
        console.error('Error adding task:', error);
    }
});

// دالة لتغيير حالة اكتمال المهمة
async function toggleTaskCompleted(id, completed) {
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        fetchTasks(); // تحديث القائمة
    } catch (error) {
        console.error('Error toggling task:', error);
    }
}

// دالة لحذف مهمة
async function deleteTask(id) {
    if (!confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        fetchTasks(); // تحديث القائمة
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// جلب المهام عند تحميل الصفحة
fetchTasks();