import bookingService from "../services/bookingService.js";

export const bookingController = {
  async list(req, res, next) {
    try {
      const bookings = await bookingService.list(req.query);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const booking = await bookingService.getById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }
      return res.json(booking);
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    try {
      const booking = await bookingService.create(req.body);
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const booking = await bookingService.update(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }
      return res.json(booking);
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const booking = await bookingService.remove(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }
      return res.json({ message: "Booking removed." });
    } catch (error) {
      return next(error);
    }
  },

  async cancel(req, res, next) {
    try {
      const booking = await bookingService.cancel(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }
      return res.json(booking);
    } catch (error) {
      return next(error);
    }
  },

  async calendar(req, res, next) {
    try {
      const events = await bookingService.calendar(req.query);
      res.json(events);
    } catch (error) {
      next(error);
    }
  },
};

export default bookingController;
