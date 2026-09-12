const Task = require('../models/task');
const User = require('../models/user');

// @desc    Create a new task with rewards based on difficulty
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, difficulty } = req.body;
    
    // Set reward values based on difficulty level
    let xp = 10, gold = 5;
    if(difficulty === 'medium') { xp = 25; gold = 15; }
    if(difficulty === 'hard') { xp = 50; gold = 30; }

    const task = new Task({
      user: req.user,
      title,
      description,
      category,
      difficulty,
      xpReward: xp,
      goldReward: gold
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Complete a task and update user stats, XP, gold, and level
// @route   PUT /api/tasks/:id/complete
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user });
    if(!task) return res.status(404).json({ msg: 'Task not found' });
    
    if(task.isCompleted) return res.status(400).json({ msg: 'Already completed' });

    task.isCompleted = true;
    await task.save();

    const user = await User.findById(req.user);
    
    // Add XP and gold rewards
    user.xp += task.xpReward;
    user.gold += task.goldReward;
    
    // Increment user stats based on task category
    if(task.category === 'strength') user.stats.strength += 1;
    if(task.category === 'intellect') user.stats.intellect += 1;
    if(task.category === 'focus') user.stats.focus += 1;

    // Level up logic: level up when XP reaches level * 100
    if(user.xp >= user.level * 100) {
      user.level += 1;
    }

    await user.save();
    res.json({ msg: 'Task completed, XP gained!', task, user });

  } catch (err) {
    res.status(500).send('Server Error');
  }
};