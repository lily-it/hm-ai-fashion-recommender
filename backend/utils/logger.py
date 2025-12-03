import logging

def setup_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    
    # Only set up handler if it hasn't been added yet
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger