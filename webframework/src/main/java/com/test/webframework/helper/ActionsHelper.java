package com.test.webframework.helper;

import java.time.LocalDateTime;
import java.util.function.Supplier;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.LoadState;
import com.microsoft.playwright.options.MouseButton;
import com.microsoft.playwright.options.SelectOption;
import com.microsoft.playwright.options.WaitForSelectorState;
import com.test.webframework.dto.ActionResponse;
import com.test.webframework.enums.ActionResultEnum;

/**
 * Enterprise-level Playwright actions helper for web automation.
 * Provides standardized web operations with comprehensive error handling,
 * logging, and response formatting.
 * 
 * @author Test Management Team
 * @version 1.0
 * @since 2025-08-18
 */
@Component
public class ActionsHelper {

    private static final Logger logger = LoggerFactory.getLogger(ActionsHelper.class);
    
    private static final int DEFAULT_TIMEOUT = 30000; // 30 seconds
    private static final int DEFAULT_WAIT_TIMEOUT = 5000; // 5 seconds

    /**
     * Executes actions safely with comprehensive error handling and logging.
     * 
     * @param action The action to execute
     * @param actionName Name of the action for logging purposes
     * @param errorMessage Custom error message prefix
     * @return ActionResponse with execution details
     */
    private ActionResponse performAction(Runnable action, String actionName, String errorMessage) {
        ActionResponse response = new ActionResponse();
        response.setStartTime(LocalDateTime.now());
        
        logger.debug("Executing action: {}", actionName);
        
        try {
            action.run();
            response.setResult(ActionResultEnum.SUCCESS);
            response.setMessage("Action completed successfully: " + actionName);
            logger.debug("Action completed successfully: {}", actionName);
        } catch (PlaywrightException e) {
            response.setResult(ActionResultEnum.FAILURE);
            response.setMessage(errorMessage + ": " + e.getMessage());
            logger.error("Playwright error in action '{}': {}", actionName, e.getMessage(), e);
        } catch (Exception e) {
            response.setResult(ActionResultEnum.FAILURE);
            response.setMessage(errorMessage + ": Unexpected error - " + e.getMessage());
            logger.error("Unexpected error in action '{}': {}", actionName, e.getMessage(), e);
        } finally {
            response.setEndTime(LocalDateTime.now());
            logger.debug("Action '{}' completed in {} ms", 
                actionName, 
                response.getEndTime().getNano() - response.getStartTime().getNano());
        }
        
        return response;
    }

    /**
     * Executes actions that return values with comprehensive error handling.
     * 
     * @param <T> Return type
     * @param supplier The supplier function to execute
     * @param actionName Name of the action for logging
     * @param errorMessage Custom error message prefix
     * @return ActionResponse with execution details and result
     */
    private <T> ActionResponse performActionWithResult(Supplier<T> supplier, String actionName, String errorMessage) {
        ActionResponse response = new ActionResponse();
        response.setStartTime(LocalDateTime.now());
        
        logger.debug("Executing action with result: {}", actionName);
        
        try {
            T result = supplier.get();
            response.setResult(ActionResultEnum.SUCCESS);
            response.setMessage(result != null ? result.toString() : "null");
            logger.debug("Action with result completed successfully: {} -> {}", actionName, result);
        } catch (PlaywrightException e) {
            response.setResult(ActionResultEnum.FAILURE);
            response.setMessage(errorMessage + ": " + e.getMessage());
            logger.error("Playwright error in action '{}': {}", actionName, e.getMessage(), e);
        } catch (Exception e) {
            response.setResult(ActionResultEnum.FAILURE);
            response.setMessage(errorMessage + ": Unexpected error - " + e.getMessage());
            logger.error("Unexpected error in action '{}': {}", actionName, e.getMessage(), e);
        } finally {
            response.setEndTime(LocalDateTime.now());
        }
        
        return response;
    }

    // ----------------------
    // Navigation Actions
    // ----------------------
    
    /**
     * Navigates to the specified URL with timeout handling.
     * 
     * @param page The page instance
     * @param url Target URL
     * @return ActionResponse with navigation result
     */
    public ActionResponse navigate(Page page, String url) {
        return performAction(
            () -> page.navigate(url, new Page.NavigateOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Navigate to " + url, 
            "Navigation failed"
        );
    }

    /**
     * Reloads the current page.
     * 
     * @param page The page instance
     * @return ActionResponse with reload result
     */
    public ActionResponse reload(Page page) {
        return performAction(
            () -> page.reload(new Page.ReloadOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Reload page", 
            "Page reload failed"
        );
    }

    /**
     * Navigates back in browser history.
     * 
     * @param page The page instance
     * @return ActionResponse with navigation result
     */
    public ActionResponse goBack(Page page) {
        return performAction(
            () -> page.goBack(new Page.GoBackOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Go back", 
            "Go back navigation failed"
        );
    }

    /**
     * Navigates forward in browser history.
     * 
     * @param page The page instance
     * @return ActionResponse with navigation result
     */
    public ActionResponse goForward(Page page) {
        return performAction(
            () -> page.goForward(new Page.GoForwardOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Go forward", 
            "Go forward navigation failed"
        );
    }

    /**
     * Retrieves the current page URL.
     * 
     * @param page The page instance
     * @return ActionResponse with current URL in message
     */
    public ActionResponse getCurrentUrl(Page page) {
        return performActionWithResult(
            page::url, 
            "Get current URL", 
            "Failed to get current URL"
        );
    }

    /**
     * Retrieves the current page title.
     * 
     * @param page The page instance
     * @return ActionResponse with page title in message
     */
    public ActionResponse getPageTitle(Page page) {
        return performActionWithResult(
            page::title, 
            "Get page title", 
            "Failed to get page title"
        );
    }

    /**
     * Waits for the specified timeout period.
     * 
     * @param page The page instance
     * @param milliseconds Timeout in milliseconds
     * @return ActionResponse with wait result
     */
    public ActionResponse waitForTimeout(Page page, int milliseconds) {
        return performAction(
            () -> page.waitForTimeout(milliseconds), 
            "Wait for timeout " + milliseconds + "ms", 
            "Wait for timeout failed"
        );
    }

    /**
     * Waits for the page to reach the specified load state.
     * 
     * @param page The page instance
     * @param state The desired load state
     * @return ActionResponse with wait result
     */
    public ActionResponse waitForLoadState(Page page, LoadState state) {
        return performAction(
            () -> page.waitForLoadState(state, new Page.WaitForLoadStateOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Wait for load state: " + state, 
            "Wait for load state failed"
        );
    }

    /**
     * Waits for a selector to be available on the page.
     * 
     * @param page The page instance
     * @param selector CSS selector to wait for
     * @return ActionResponse with wait result
     */
    public ActionResponse waitForSelector(Page page, String selector) {
        return performAction(
            () -> page.waitForSelector(selector, new Page.WaitForSelectorOptions()
                .setTimeout(DEFAULT_WAIT_TIMEOUT)
                .setState(WaitForSelectorState.VISIBLE)), 
            "Wait for selector: " + selector, 
            "Wait for selector failed"
        );
    }

    /**
     * Checks if the page is ready for interaction.
     * 
     * @param page The page instance
     * @return ActionResponse indicating readiness
     */
    public ActionResponse isPageReady(Page page) {
        return performActionWithResult(
            () -> {
                page.waitForLoadState(LoadState.DOMCONTENTLOADED);
                return "Page is ready for interaction";
            },
            "Check page readiness",
            "Failed to check page readiness"
        );
    }

    // ----------------------
    // Element Actions
    // ----------------------

    /**
     * Clicks on an element specified by selector.
     * 
     * @param page The page instance
     * @param selector CSS selector of the element to click
     * @return ActionResponse with click result
     */
    public ActionResponse click(Page page, String selector) {
        return performAction(
            () -> page.click(selector, new Page.ClickOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Click element: " + selector, 
            "Click action failed"
        );
    }

    /**
     * Double-clicks on an element specified by selector.
     * 
     * @param page The page instance
     * @param selector CSS selector of the element to double-click
     * @return ActionResponse with double-click result
     */
    public ActionResponse doubleClick(Page page, String selector) {
        return performAction(
            () -> page.dblclick(selector, new Page.DblclickOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Double-click element: " + selector, 
            "Double-click action failed"
        );
    }

    /**
     * Right-clicks on an element specified by selector.
     * 
     * @param page The page instance
     * @param selector CSS selector of the element to right-click
     * @return ActionResponse with right-click result
     */
    public ActionResponse rightClick(Page page, String selector) {
        return performAction(
            () -> page.click(selector, new Page.ClickOptions().setButton(MouseButton.RIGHT).setTimeout(DEFAULT_TIMEOUT)), 
            "Right-click element: " + selector, 
            "Right-click action failed"
        );
    }

    /**
     * Types text into an input element character by character.
     * 
     * @param page The page instance
     * @param selector CSS selector of the input element
     * @param text Text to type
     * @return ActionResponse with type result
     */
    public ActionResponse type(Page page, String selector, String text) {
        return performAction(
            () -> {
                page.locator(selector).clear();
                page.locator(selector).pressSequentially(text);
            }, 
            "Type text '" + text + "' into: " + selector, 
            "Type action failed"
        );
    }

    /**
     * Fills an input element with text (faster than type).
     * 
     * @param page The page instance
     * @param selector CSS selector of the input element
     * @param text Text to fill
     * @return ActionResponse with fill result
     */
    public ActionResponse fill(Page page, String selector, String text) {
        return performAction(
            () -> page.fill(selector, text, new Page.FillOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Fill text '" + text + "' into: " + selector, 
            "Fill action failed"
        );
    }

    /**
     * Clears the content of an input element.
     * 
     * @param page The page instance
     * @param selector CSS selector of the input element
     * @return ActionResponse with clear result
     */
    public ActionResponse clear(Page page, String selector) {
        return performAction(
            () -> page.fill(selector, "", new Page.FillOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Clear element: " + selector, 
            "Clear action failed"
        );
    }

    /**
     * Selects an option from a dropdown by value.
     * 
     * @param page The page instance
     * @param selector CSS selector of the select element
     * @param value Value to select
     * @return ActionResponse with select result
     */
    public ActionResponse selectByValue(Page page, String selector, String value) {
        return performAction(
            () -> page.selectOption(selector, value, new Page.SelectOptionOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Select option by value '" + value + "' in: " + selector, 
            "Select by value failed"
        );
    }

    /**
     * Selects an option from a dropdown by visible text.
     * 
     * @param page The page instance
     * @param selector CSS selector of the select element
     * @param text Visible text of the option to select
     * @return ActionResponse with select result
     */
    public ActionResponse selectByText(Page page, String selector, String text) {
        return performAction(
            () -> page.selectOption(selector, new SelectOption().setLabel(text), new Page.SelectOptionOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Select option by text '" + text + "' in: " + selector, 
            "Select by text failed"
        );
    }

    /**
     * Checks a checkbox or radio button.
     * 
     * @param page The page instance
     * @param selector CSS selector of the checkbox/radio element
     * @return ActionResponse with check result
     */
    public ActionResponse check(Page page, String selector) {
        return performAction(
            () -> page.check(selector, new Page.CheckOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Check element: " + selector, 
            "Check action failed"
        );
    }

    /**
     * Unchecks a checkbox.
     * 
     * @param page The page instance
     * @param selector CSS selector of the checkbox element
     * @return ActionResponse with uncheck result
     */
    public ActionResponse uncheck(Page page, String selector) {
        return performAction(
            () -> page.uncheck(selector, new Page.UncheckOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Uncheck element: " + selector, 
            "Uncheck action failed"
        );
    }

    /**
     * Hovers over an element.
     * 
     * @param page The page instance
     * @param selector CSS selector of the element to hover
     * @return ActionResponse with hover result
     */
    public ActionResponse hover(Page page, String selector) {
        return performAction(
            () -> page.hover(selector, new Page.HoverOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Hover over element: " + selector, 
            "Hover action failed"
        );
    }

    /**
     * Gets the text content of an element.
     * 
     * @param page The page instance
     * @param selector CSS selector of the element
     * @return ActionResponse with element text in message
     */
    public ActionResponse getText(Page page, String selector) {
        return performActionWithResult(
            () -> page.textContent(selector), 
            "Get text from: " + selector, 
            "Get text failed"
        );
    }

    /**
     * Gets the value of an input element.
     * 
     * @param page The page instance
     * @param selector CSS selector of the input element
     * @return ActionResponse with input value in message
     */
    public ActionResponse getValue(Page page, String selector) {
        return performActionWithResult(
            () -> page.inputValue(selector), 
            "Get value from: " + selector, 
            "Get value failed"
        );
    }

    /**
     * Gets an attribute value of an element.
     * 
     * @param page The page instance
     * @param selector CSS selector of the element
     * @param attributeName Name of the attribute
     * @return ActionResponse with attribute value in message
     */
    public ActionResponse getAttribute(Page page, String selector, String attributeName) {
        return performActionWithResult(
            () -> page.getAttribute(selector, attributeName), 
            "Get attribute '" + attributeName + "' from: " + selector, 
            "Get attribute failed"
        );
    }

    /**
     * Checks if an element is visible.
     * 
     * @param page The page instance
     * @param selector CSS selector of the element
     * @return ActionResponse with visibility status in message
     */
    public ActionResponse isVisible(Page page, String selector) {
        return performActionWithResult(
            () -> page.isVisible(selector), 
            "Check visibility of: " + selector, 
            "Visibility check failed"
        );
    }

    /**
     * Checks if an element is enabled.
     * 
     * @param page The page instance
     * @param selector CSS selector of the element
     * @return ActionResponse with enabled status in message
     */
    public ActionResponse isEnabled(Page page, String selector) {
        return performActionWithResult(
            () -> page.isEnabled(selector), 
            "Check enabled status of: " + selector, 
            "Enabled check failed"
        );
    }

    /**
     * Checks if a checkbox/radio is checked.
     * 
     * @param page The page instance
     * @param selector CSS selector of the checkbox/radio element
     * @return ActionResponse with checked status in message
     */
    public ActionResponse isChecked(Page page, String selector) {
        return performActionWithResult(
            () -> page.isChecked(selector), 
            "Check checked status of: " + selector, 
            "Checked status check failed"
        );
    }

    /**
     * Scrolls an element into view.
     * 
     * @param page The page instance
     * @param selector CSS selector of the element
     * @return ActionResponse with scroll result
     */
    public ActionResponse scrollIntoView(Page page, String selector) {
        return performAction(
            () -> page.locator(selector).scrollIntoViewIfNeeded(), 
            "Scroll into view: " + selector, 
            "Scroll into view failed"
        );
    }

    /**
     * Focuses on an element.
     * 
     * @param page The page instance
     * @param selector CSS selector of the element
     * @return ActionResponse with focus result
     */
    public ActionResponse focus(Page page, String selector) {
        return performAction(
            () -> page.focus(selector, new Page.FocusOptions().setTimeout(DEFAULT_TIMEOUT)), 
            "Focus on element: " + selector, 
            "Focus action failed"
        );
    }

}
