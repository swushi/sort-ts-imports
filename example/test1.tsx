//@ts-nocheck
import React, { memo, useCallback, useMemo } from 'react';

import { useDebugLog } from 'hooks/debug/useDebugLog';
import { useRenderCounter } from 'hooks/debug/useRenderCounter';
import useWidgetHeader from 'components/common/WidgetHeader/useWidgetHeader';

import { IWidget } from 'components/common/Widget/Widget.types';
import { INewsWidgetResponse } from '@ibbleinc/api-common';

import NewsCardPlaceholder from './NewsCardPlaceholder';
import NewsCard from './NewsCard';
// a random comment
import useSystemEventPublisher from 'hooks/services/useSystemEventPublisher';
import { SystemEventName } from 'types/events/system';
import { useServices } from '../../../hooks/providers/useServices';

import { 
  anoterh, 
  weird, 
  idk 
} from 'hooks/idk';
import { LinkAction } from 'services/link/linkAction.service';
import { GumstickCommentProps } from 'components/GumstickComment/GumstickComment';
import { elapsedTimeFromDate } from 'utils/time';

// This is another huge comment

const debug = false;
const debugLogs = false && debug;
const debugRenders = false && debug;

const reactIconStyle = { width: 22, height: 28 };
const commentIconStyle = { width: 22, height: 22 };

const NewsCardWrapper: React.FC<IWidget<INewsWidgetResponse>> = memo(({ data, mutate }) => {
  useRenderCounter('NewsCardWrapper', debugRenders);
  const debugLog = useDebugLog('NewsCardWrapper', debugLogs);

  const { linkActionService } = useServices();
  const publishSystemEvent = useSystemEventPublisher();

  const widgetHeaderProps = useWidgetHeader({
    header: data?.meta?.header,
    overflowAnalyticEvent: 'view_all__news_card'
  });

  const onReactPress = useCallback(() => {
    debugLog('onReactPress');
    const hasReacted = data?.meta?.hasReacted || false;
    const analytic: SystemEventName = hasReacted ? 'unreact__news_card' : 'react__news_card';
    const link = hasReacted ? data?.links?.unreact : data?.links?.react;

    mutate(data => {
      const metaMutated = Object.assign({}, data?.meta, { hasReacted: !hasReacted });
      const dataMutated = Object.assign({}, data, metaMutated);
      return dataMutated;
    }, false);

    publishSystemEvent(analytic);
    link && linkActionService.enqueueAction(link as LinkAction);
  }, [
    data?.links?.react,
    data?.links?.unreact,
    data?.meta?.hasReacted,
    debugLog,
    linkActionService,
    mutate,
    publishSystemEvent
  ]);

  const onCommentPress = useCallback(() => {
    debugLog('onCommentPress');
    publishSystemEvent('comment__news_card');
    const link = data?.links?.comment;
    link && linkActionService.enqueueAction(link as LinkAction);
  }, [data?.links?.comment, debugLog, linkActionService, publishSystemEvent]);

  const onSharePress = useCallback(() => {
    debugLog('onSharePress');
    publishSystemEvent('share__news_card');
    const link = data?.links?.share;
    link && linkActionService.enqueueAction(link as LinkAction);
  }, [data?.links?.share, debugLog, linkActionService, publishSystemEvent]);

  const onViewAllLinkedPress = useCallback(() => {
    debugLog('onViewAllLinkedPress');
    publishSystemEvent('view_all_comments__news_card');
    const link = data?.meta?.comment?.links?.viewAllComments;
    link && linkActionService.enqueueAction(link as LinkAction);
  }, [data?.meta?.comment?.links?.viewAllComments, debugLog, linkActionService, publishSystemEvent]);

  const onStoryPress = useCallback(() => {
    debugLog('onStoryPress');
    publishSystemEvent('view_article__news_card');
    const link = data?.links?.self;
    link && linkActionService.enqueueAction(link as LinkAction);
  }, [data?.links?.self, debugLog, linkActionService, publishSystemEvent]);

  const onGumstickCommentPress = useCallback(() => {
    debugLog('onGumstickCommentPress');
    publishSystemEvent('view_gumstick_comment__news_card');
    const link = data?.meta?.comment?.links?.viewAllComments;
    link && linkActionService.enqueueAction(link as LinkAction);
  }, [data?.meta?.comment?.links?.viewAllComments, debugLog, linkActionService, publishSystemEvent]);

  const onGumstickProfilePress = useCallback(() => {
    debugLog('onGumstickProfilePress');
    publishSystemEvent('view_profile_gumstick_comment__news_card');
    const link = data?.meta?.comment?.links?.viewAuthor;
    link && linkActionService.enqueueAction(link as LinkAction);
  }, [data?.meta?.comment?.links?.viewAuthor, debugLog, linkActionService, publishSystemEvent]);

  const gumstickComment = useMemo<GumstickCommentProps | undefined>(() => {
    const comment = data?.meta?.comment;
    if (!comment) return;

    const commentAge = comment.commentedAt ? new Date(comment.commentedAt) : new Date();

    return {
      authorImageUrl: comment.user?.userImageUrl || '',
      authorName: comment.user?.displayName || comment.user?.userName || '',
      comment: comment.commentText,
      commentAge: elapsedTimeFromDate(commentAge, 'LONG_FORM'),
      onPress: onGumstickCommentPress,
      onProfilePress: onGumstickProfilePress
    };
  }, [data?.meta?.comment, onGumstickCommentPress, onGumstickProfilePress]);

  if (!data) return <NewsCardPlaceholder />;
  return (
    <NewsCard
      {...widgetHeaderProps}
      byLineSource={data?.meta?.source}
      byLineWhen={data?.meta?.comment?.commentedAt}
      headline={data?.meta?.headline}
      mainImageUrl={data?.meta?.postImageUrl}
      hasReacted={data?.meta?.hasReacted}
      statsText={data?.meta?.metricsText}
      reactText={data?.links?.react?.meta?.primaryTitle || 'Like'}
      reactIconUrl={data?.links?.react?.meta?.primaryImage || ''}
      reactIconStyle={data?.links?.react?.meta?.primaryImageStyle || reactIconStyle}
      reactedText={data?.links?.unreact?.meta?.primaryTitle || 'Liked'}
      reactedIconUrl={data?.links?.unreact?.meta?.primaryImage || ''}
      reactedIconStyle={data?.links?.unreact?.meta?.primaryImageStyle || reactIconStyle}
      commentsText={data?.links?.comment?.meta?.primaryTitle || 'Comment'}
      commentsIconUrl={data?.links?.comment?.meta?.primaryImage || ''}
      commentsIconStyle={data?.links?.comment?.meta?.primaryImageStyle || commentIconStyle}
      linksText={data?.links?.share?.meta?.primaryTitle || 'Share'}
      linksIconUrl={data?.links?.share?.meta?.primaryImage || ''}
      linksIconStyle={data?.links?.share?.meta?.primaryImageStyle || commentIconStyle}
      gumstickComment={gumstickComment}
      onReactPress={onReactPress}
      onCommentPress={onCommentPress}
      onSharePress={onSharePress}
      onViewAllLinkedPress={onViewAllLinkedPress}
      onStoryPress={onStoryPress}
    />
  );
});

export default NewsCardWrapper;
