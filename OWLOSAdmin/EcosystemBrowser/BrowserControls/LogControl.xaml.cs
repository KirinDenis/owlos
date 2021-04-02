using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OWLOSAdmin.EcosystemBrowser.BrowserControls
{
    /// <summary>
    /// Interaction logic for LogControl.xaml
    /// </summary>
    public partial class LogControl : UserControl
    {
        private int logCount = 0;
        private double saveY = 0;
        private bool atAnimation = false;

        public LogControl()
        {
            InitializeComponent();
        }

        public void AddToLog(string text, int code)
        {
            if (!string.IsNullOrEmpty(text))
            {
                List<string> lines = text.Split('\n').ToList();
                foreach (string line in lines)
                {
                    Add(line, code);
                }
            }
            else
            {
                Add("--> NULL line to log", 3);
            }
        }

        private void Add(string text, int code)
        {

            base.Dispatcher.Invoke(() =>
            {

                if (!string.IsNullOrEmpty(text))
                {
                    TextBlock textBlock = new TextBlock();
                    logPanel.Children.Add(textBlock);
                    logCount++;
                    textBlock.Name = "text" + logCount.ToString();

                    
                    if (!atAnimation)
                    {
                        atAnimation = true;
                        double EndY;
                        TextBlock prev = logPanel.Children[0] as TextBlock;
                        if (prev.ActualHeight != double.NaN)
                        {
                            if (prev.ActualHeight < 20)
                            {

                                EndY = -(logCount * prev.ActualHeight / 1.0f - GlobalOutLogScrollViewer.ActualHeight);
                            }
                            else
                            {
                                EndY = -(logCount * prev.ActualHeight / 4.0f - GlobalOutLogScrollViewer.ActualHeight);
                            }
                        }
                        else
                        {
                            EndY = -logCount * 15;
                        }

                        DoubleAnimation AnimationY = new DoubleAnimation(saveY, EndY, TimeSpan.FromSeconds(1));
                        AnimationY.Completed += AnimationY_Completed;
                        saveY = EndY;

                        TranslateTransform Transform = new TranslateTransform();
                        logPanel.RenderTransform = Transform;

                        Transform.BeginAnimation(TranslateTransform.YProperty, AnimationY);
                    }

                    ColorAnimation animation = new ColorAnimation
                    {
                        Duration = new Duration(TimeSpan.FromSeconds(10))
                    };

                    /*
                    switch (code)
                    {
                        case 0:
                            animation.To = SystemColors.ControlTextColor;
                            textBlock.Foreground = SystemColors.ControlTextBrush;
                            break;
                        case 1:
                            animation.To = SystemColors.WindowFrameColor;
                            textBlock.Foreground = SystemColors.ScrollBarBrush;
                            break;
                        case 3:
                            animation.To = ((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha4"]).Color;
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDanger"]).Color);
                            break;
                        default:
                            animation.To = SystemColors.HotTrackColor;
                            textBlock.Foreground = SystemColors.MenuBarBrush;
                            break;
                    }
                    */

                    switch (code)
                    {
                        case 0:
                            animation.To = SystemColors.ControlTextColor; 
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSecondary"]).Color);
                            break;
                        case 1:
                            animation.To = ((SolidColorBrush)App.Current.Resources["OWLOSWarningAlpha4"]).Color;
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSWarning"]).Color);
                            break;
                        case 3:
                            animation.To = ((SolidColorBrush)App.Current.Resources["OWLOSDangerAlpha4"]).Color;
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSDanger"]).Color);
                            break;
                        default:
                            animation.To = SystemColors.ControlTextColor;
                            textBlock.Foreground = new SolidColorBrush(((SolidColorBrush)App.Current.Resources["OWLOSSecondary"]).Color);
                            break;

                    }


                    textBlock.Foreground.BeginAnimation(SolidColorBrush.ColorProperty, animation);


                    //https://stackoverflow.com/questions/3430659/is-there-a-wpf-typewriter-effect
                    Storyboard story = new Storyboard
                    {
                        FillBehavior = FillBehavior.HoldEnd
                    };

                    StringAnimationUsingKeyFrames stringAnimationUsingKeyFrames = new StringAnimationUsingKeyFrames
                    {
                        Duration = new Duration(TimeSpan.FromSeconds(1))
                    };


                    string tempText = string.Empty;
                    text = DateTime.Now + " " + text;
                    foreach (char c in text)
                    {
                        DiscreteStringKeyFrame discreteStringKeyFrame = new DiscreteStringKeyFrame
                        {
                            KeyTime = KeyTime.Paced
                        };
                        tempText += c;
                        stringAnimationUsingKeyFrames.KeyFrames.Add(discreteStringKeyFrame);
                        if (tempText.Length < text.Length)
                        {
                            discreteStringKeyFrame.Value = tempText + "█";
                        }
                        else
                        {
                            discreteStringKeyFrame.Value = tempText;
                        }

                    }
                    Storyboard.SetTargetProperty(stringAnimationUsingKeyFrames, new PropertyPath(TextBlock.TextProperty));
                    story.Children.Add(stringAnimationUsingKeyFrames);

                    story.Begin(textBlock);

                }
                //GlobalOutLogScrollViewer.ScrollToBottom();
            });
        }

        private void AnimationY_Completed(object sender, EventArgs e)
        {
            atAnimation = false;
        }


    }
}
